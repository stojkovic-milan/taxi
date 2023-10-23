"use client"
import RideService, { FilterCriteria, PaginationCriteria } from '@/services/RideService';
import { Accordion, AccordionSummary, Typography, AccordionDetails, Pagination, Box, Tabs, Tab } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import RideFilter from '@/components/rideFilter/rideFilter';
import { initialFilterCriteria } from '../../list/page';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, Pie, PieChart, LineChart, Line, RadarChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, ComposedChart } from 'recharts';
import StatisticsService from '@/services/StatisticsService';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/common/loadingSpinner/loadingSpinner';
import { scaleSymlog } from 'd3-scale';

interface GraphData {
    name: string,
    Rides: number
}
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF33FF', '#33CCFF', '#FF6633'];
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


export default function Page() {
    const [loading, setLoading] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>(initialFilterCriteria);
    const [chargeDistribution, setChargeDistribution] = useState([]);
    const [tipPerDistanceDistribution, setTipPerDistanceDistribution] = useState([]);
    const [tipPercentageDistribution, setTipPercentageDistribution] = useState([]);
    const [paymentTypeDistribution, setPaymentTypeDistribution] = useState([]);
    const router = useRouter()
    const logScale = scaleSymlog();

    useEffect(() => {
        const fetchTipPercentageDistribution = async () => {
            try {
                const { data: response, status } = await StatisticsService.getTipPercentageDistribution();
                setTipPercentageDistribution(response.map(([name, pv]) => ({ name, Rides: pv })))
            } catch (error) {
                if (axios.isAxiosError(error)) console.error(error.message);
            }
        };
        const fetchChargeDistribution = async () => {
            try {
                const { data: response, status } = await StatisticsService.getChargeDistribution();
                setChargeDistribution(response)
            } catch (error) {
                if (axios.isAxiosError(error)) console.error(error.message);
            }
        };
        const fetchTipPerDistanceDistribution = async () => {
            try {
                const { data: response, status } = await StatisticsService.getTipPerDistanceDistribution();
                setTipPerDistanceDistribution(response.map(([name, pv]) => ({ name: name.toString(), Tip: pv })))
            } catch (error) {
                if (axios.isAxiosError(error)) console.error(error.message);
            }
        };
        const fetchPaymentTypeDistribution = async () => {
            try {
                const { data: response, status } = await StatisticsService.getPaymentTypeDistribution();
                let otherTypeCount = response[2][1] + response[3][1] + response[4][1];
                let res = [response[0], response[1], ['Other', otherTypeCount]]
                const formatedData = res.map((item) => ({
                    name: item[0],
                    percent: item[1],
                }));
                setPaymentTypeDistribution(formatedData)
            } catch (error) {
                if (axios.isAxiosError(error)) console.error(error.message);
            }
        };
        setLoading(true);
        // fetchTipPercentageDistribution();
        // fetchTipPerDistanceDistribution();
        // fetchChargeDistribution();
        Promise.all([
            fetchTipPerDistanceDistribution(),
            fetchChargeDistribution(),
            fetchPaymentTypeDistribution(),
            fetchTipPercentageDistribution()]).then(() => setLoading(false))
        // setLoading(false);
    }, []);

    const formatRadarChartData = (responseData) => {
        return [
            // { subject: 'Fare', A: responseData.totalFare },
            { subject: 'Extra', A: responseData.totalExtra },
            { subject: 'MTA Tax', A: responseData.totalMta },
            { subject: 'Tips', A: responseData.totalTips },
            { subject: 'Tolls', A: responseData.totalTolls },
            { subject: 'Improvement', A: responseData.totalImprovment },
        ];
    };
    // const handleFilterSubmit = () => {
    //     const filterRides = async () => {
    //         try {
    //             const { data: response, status } = await RideService.getRides(paginationModel, filterCriteria);
    //             setRides(response.rides);
    //             setRowCountState((prevRowCountState) =>
    //                 response.totalCount !== undefined ? response.totalCount : prevRowCountState,
    //             );
    //         } catch (error) {
    //             if (axios.isAxiosError(error)) console.error(error.message);
    //         }
    //     }
    //     setLoading(true)
    //     filterRides()
    //     setLoading(false)
    // }

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
            {/* <RideFilter
                fetchFilteredRides={handleFilterSubmit}
                filterCriteria={filterCriteria}
                setFilterCriteria={setFilterCriteria} /> */}
            {loading && (
                <div className="flex flex-grow justify-center absolute top-1/2 left-1/2 z-10 w-24 h-24 bg-white shadow-lg rounded-lg">
                    <div className="flex flex-col justify-center">
                        <LoadingSpinner />
                    </div>
                </div>
            )}
            <Box sx={{ width: '100%' }}>
                <Tabs value={1} onChange={handleChange} aria-label="nav tabs example">
                    <Tab label="Time series statistics" onClick={() => router.push("/statistics/time")} />
                    <Tab label="Financial statistics" />
                    <Tab label="General statistics" onClick={() => router.push("/statistics/general")} />
                </Tabs>
            </Box>
            <div className='h-full w-full flex flex-row flex-wrap content-start'>
                <ResponsiveContainer width="28%" height="50%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={formatRadarChartData(chargeDistribution)}>
                        <text x="175" y="6" dominantBaseline="hanging" fontSize="20" stroke='orange' fill='orange'>
                            Charge distribution
                        </text>
                        <PolarGrid />
                        <Tooltip />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis />
                        <Radar name="Percentage"
                            dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </RadarChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="72%" height="40%">
                    <ScatterChart
                        width={500}
                        height={300}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <text x="450" y="6" dominantBaseline="hanging" fontSize="20" stroke='orange' fill='orange'>
                            Tip per distance distribution
                        </text>
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        {/* <XAxis dataKey="name" type="number" label={{ value: 'Index', position: 'insideBottomRight', offset: 0 }} />
                        <YAxis unit="ms" type="number" label={{ value: 'Time', angle: -90, position: 'insideLeft' }} /> */}
                        <XAxis dataKey="name" unit={'mi'} />
                        <YAxis dataKey="Tip" unit={'$'} scale={'sqrt'} />
                        <Legend />
                        <Scatter name="Tip" data={tipPerDistanceDistribution} fill="#8884d8" radius={1} />
                        {/* <Line type="monotone" dataKey="Tip" stroke="#8884d8" activeDot={{ r: 2 }} dot={{ r: 1 }} /> */}
                    </ScatterChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="30%" height="35%">
                    <PieChart width={300} height={250}>
                        <Pie data={paymentTypeDistribution} dataKey="percent" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label={(en) => en.name}>
                            {paymentTypeDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <text x="175" y="10" dominantBaseline="hanging" fontSize="20" stroke='orange' fill='orange'>
                            Payment type distribution</text>
                        <Tooltip />
                        {/* <Legend /> */}
                    </PieChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="70%" height="40%">
                    <LineChart
                        width={600}
                        height={300}
                        data={tipPercentageDistribution} // Use the formatted data here
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                        }}
                    >
                        <text x="425" y="10" dominantBaseline="hanging" fontSize="20" stroke='orange' fill='orange'>
                            Tip percentage distribution
                        </text>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" unit={'%'} scale={logScale} />
                        <YAxis width={70} scale={'pow'} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Rides" stroke="#8884d8" activeDot={{ r: 2 }} dot={{ r: 1 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

        </div>
    )
}