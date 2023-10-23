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
import { DataGrid, GridColDef, GridColumnHeaderParams } from '@mui/x-data-grid';
import dynamic from 'next/dynamic';
import Geohash from 'latlon-geohash';

interface GraphData {
    name: string,
    Rides: number
}
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF33FF', '#33CCFF', '#FF6633'];
const Map = dynamic(() => import('../../../components/geohashMap/geohashMap'), {
    ssr: false,
});

export default function Page() {
    const [loading, setLoading] = useState(false);
    const [passengerCountDistribution, setPassengerCountDistribution] = useState([]);
    const [tipPercentagePerPassengerCountDistribution, setTipPercentagePerPassengerCountDistribution] = useState([]);
    const [generalStats, setGeneralStats] = useState([]);
    const [topGeohashesPrecise, setTopGeohashesPrecise] = useState([]);
    const [topGeohashesBroad, setTopGeohashesBroad] = useState([]);

    const columns: GridColDef[] = [
        // { field: "id", headerName: "Id", flex: 1 },
        {
            field: "stat", headerName: "Statistic", flex: 1,
            renderHeader: (params: GridColumnHeaderParams) => (
                <div className='font-bold text-xl'>
                    {'Statistic'}
                </div>
            ),
        },
        {
            field: "value", headerName: "Value", flex: 1,
            renderHeader: (params: GridColumnHeaderParams) => (
                <div className='font-bold text-xl'>
                    {'Value'}
                </div>
            ),
        }
    ];
    const [currentRows, setCurrentRows] = useState<
        Array<{ id: number, stat: string, value: string }>>([]);
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
        const fetchTipPerPassengerCount = async () => {
            try {
                const { data: response, status } =
                    await StatisticsService.getTipPerPassengerCount();
                const formatedData = response.map((item) => ({
                    name: item[0],
                    Percentage: item[1],
                }));
                setTipPercentagePerPassengerCountDistribution(formatedData)
            } catch (error) {
                if (axios.isAxiosError(error)) console.error(error.message);
            }
        };
        const fetchGeneralStatistics = async () => {
            try {
                const { data: response, status } =
                    await StatisticsService.getGeneralStats();
                setGeneralStats(response)
                setCurrentRows(response.map((r, ind) =>
                ({
                    id: ind,
                    stat: r[0],
                    value: r[1]
                })))
            } catch (error) {
                if (axios.isAxiosError(error)) console.error(error.message);
            }
        };
        const fetchTopGeohashesPrecise = async () => {
            try {
                const { data: response, status } =
                    await StatisticsService.getTopGeohashPrecise();
                const formatedData = response.map((item) => {
                    const latlon = Geohash.decode(item[0])
                    return ({
                        pos: { lat: latlon.lat, lng: latlon.lon },
                        count: item[1]
                    })
                })
                console.log(formatedData)
                setTopGeohashesPrecise(formatedData)
            } catch (error) {
                if (axios.isAxiosError(error)) console.error(error.message);
            }
        };
        const fetchTopGeohashesBroad = async () => {
            try {
                const { data: response, status } =
                    await StatisticsService.getTopGeohashBroad();
                const formatedData = response.map((item) => {
                    const latlon = Geohash.decode(item[0])
                    return ({
                        pos: { lat: latlon.lat, lng: latlon.lon },
                        count: item[1]
                    })
                })
                setTopGeohashesBroad(formatedData)
            } catch (error) {
                if (axios.isAxiosError(error)) console.error(error.message);
            }
        };
        setLoading(true);
        Promise.all([fetchPassengerCountDistribution(), fetchGeneralStatistics(), fetchTipPerPassengerCount(), fetchTopGeohashesPrecise(), fetchTopGeohashesBroad()]).then(() => setLoading(false))
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
                </Tabs>
            </Box>
            <div className='w-full h-full flex'>
                <div className='w-1/4 pt-8 h-5/6'>
                    {/* <Container maxWidth="md" style={{ marginTop: '50px' }}>
                        <Typography variant="h4">Statistics</Typography>
                        <ul>
                            {generalStats.map(s => <li>{`${s[0]}: ${s[1]}`}</li>)}
                        </ul>
                    </Container> */}
                    <DataGrid
                        density='standard'
                        rows={currentRows}
                        columns={columns}
                        disableColumnMenu
                        hideFooter
                        className='bg-blue-100'
                        sx={{
                            fontSize: 18,
                            boxShadow: 2,
                            border: 2,
                            borderColor: 'primary.light',
                            '& .MuiDataGrid-cell:hover': {
                                color: 'primary.main',
                            },
                        }}
                    />
                </div>
                <div className='h-full w-full flex flex-row flex-wrap
                 pt-5 content-start justify-around'>
                    <ResponsiveContainer width="50%" height="45%">
                        <PieChart width={300} height={250}>
                            <Pie data={passengerCountDistribution} dataKey="count" cx="50%" cy="50%" outerRadius={120} fill="#8884d8" label={(en) => en.name}>
                                {passengerCountDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            {/* <Legend /> */}
                            <text x="200" y="6" dominantBaseline="hanging" fontSize="20" stroke='orange' fill='orange'>
                                Passenger count distribution
                            </text>
                        </PieChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width="50%" height="45%">
                        <BarChart
                            title='Rides by time of day'
                            width={400}
                            height={270}
                            data={tipPercentagePerPassengerCountDistribution}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <text x="250" y="0" dominantBaseline="hanging" fontSize="20" stroke='orange' fill='orange'>
                                Average tip percentage by passenger count
                            </text>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis width={70} unit={"%"} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Percentage" fill="#8884d8" />
                            {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
                        </BarChart>
                    </ResponsiveContainer>
                    <div className='w-full h-2/5 flex'>
                        <div className='w-1/2 h-full ml-4 shadow-xl flex flex-col justify-center' >
                            <div className='h-7 text-xl w-full text-center'>
                                <span className='text-orange-400 font-bold'>Precise geohash with most pickups (23409m<sup>2</sup>)</span>
                            </div>
                            <div className='h-full w-full border-2 border-blue-300'>
                                {topGeohashesPrecise.length > 0 && <Map metersInHash={153} hashes={topGeohashesPrecise} />}
                            </div>
                        </div>
                        <div className='w-1/2 h-full ml-4 shadow-xl flex flex-col justify-center' >
                            <div className='h-7 text-xl w-full text-center'>
                                <span className='text-orange-400 font-bold'>Broad geohash with most pickups (23.91km<sup>2</sup>)</span>
                            </div>
                            <div className='h-full w-full border-2 border-blue-300'>
                                {topGeohashesBroad.length > 0 && <Map metersInHash={4890} hashes={topGeohashesBroad} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}