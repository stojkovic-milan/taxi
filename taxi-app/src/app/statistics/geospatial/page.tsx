"use client"
import RideService, { FilterCriteria, PaginationCriteria } from '@/services/RideService';
import { Accordion, AccordionSummary, Typography, AccordionDetails, Pagination, Box, Tabs, Tab, Container } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import RideFilter from '@/components/rideFilter/rideFilter';
import { initialFilterCriteria } from '../../list/page';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, Pie, PieChart, LineChart, Line, RadarChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar } from 'recharts';
import StatisticsService from '@/services/StatisticsService';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/common/loadingSpinner/loadingSpinner';

interface GraphData {
    name: string,
    Rides: number
}
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF33FF', '#33CCFF', '#FF6633'];
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


export default function Page() {
    const [loading, setLoading] = useState(false);
    const [passengerCountDistribution, setPassengerCountDistribution] = useState([]);
    const router = useRouter()

    useEffect(() => {
        const fetchPassengerCountDistribution = async () => {
            try {
                const { data: response, status } =
                    await StatisticsService.getPassengerCountDistribution();
                const formatedData = response.map((item) => ({
                    name: item[0],
                    count: item[1],
                }));
                setPassengerCountDistribution(formatedData)
            } catch (error) {
                if (axios.isAxiosError(error)) console.error(error.message);
            }
        };
        setLoading(true);
        Promise.all([fetchPassengerCountDistribution()]).then(() => setLoading(false))
    }, []);

    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        // event.type can be equal to focus with selectionFollowsFocus.
        if (
            event.type !== 'click'
            // ||
            // (event.type === 'click' &&
            //     samePageLinkNavigation(
            //         event as React.MouseEvent<HTMLAnchorElement, MouseEvent>,
            //     ))
        ) {
            setValue(newValue);
        }
    };

    return (
        <div className="min-h-screen items-center justify-between p-2 h-screen bg-white text-blue-800">
            {loading && (
                <div className="flex flex-grow justify-center absolute top-1/2 left-1/2 z-10 w-24 h-24 bg-white shadow-lg rounded-lg">
                    <div className="flex flex-col justify-center">
                        <LoadingSpinner />
                    </div>
                </div>
            )}
            <Box sx={{ width: '100%' }}>
                <Tabs value={2} onChange={handleChange} aria-label="nav tabs example">
                    <Tab label="Time series statistics"
                        onClick={() => router.push("/statistics/time")} />
                    <Tab label="Financial statistics" onClick={() => router.push("/statistics/financial")} />
                    <Tab label="General statistics" />
                    <Tab label="Geospatial statistics" />
                </Tabs>
            </Box>
            <span>Based on 161,843,930 rides</span>
            <div className='h-full w-full flex flex-row flex-wrap'>
                <ResponsiveContainer width="33%" height="30%">
                    <PieChart width={300} height={250}>
                        <Pie data={passengerCountDistribution} dataKey="count" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label={(en) => en.name}>
                            {passengerCountDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
                <div>
                    <Container maxWidth="md" style={{ marginTop: '50px' }}>
                        <Typography variant="h4">Statistics</Typography>
                        <ul>
                            <li>Total Number of Trips: </li>
                            <li>Average Trip Distance: </li>
                            <li>Average Fare Amount: </li>
                            {/* Add other statistics here */}
                        </ul>
                    </Container>
                </div>
            </div>

        </div>
    )
}