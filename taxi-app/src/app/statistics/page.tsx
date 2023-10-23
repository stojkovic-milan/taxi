"use client"
import { FilterCriteria } from '@/services/RideService';
import { Box, Tabs, Tab } from '@mui/material';
import { useEffect, useState } from 'react';
import { initialFilterCriteria } from '../list/page';
import { redirect, useRouter } from 'next/navigation';

interface GraphData {
    name: string,
    Rides: number
}
export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF33FF', '#33CCFF', '#FF6633'];
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


export default function Page() {
    redirect('/statistics/time');

    const [loading, setLoading] = useState(true);
    const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>(initialFilterCriteria);
    const [tipPercentageDistribution, setTipPercentageDistribution] = useState<[]>([])
    const [tipPerDistanceDistribution, setTipPerDistanceDistribution] = useState([]);
    const router = useRouter()

    useEffect(() => {
        // const fetchTipPercentageDistribution = async () => {
        //     try {
        //         const { data: response, status } = await StatisticsService.getTipPercentageDistribution();
        //         setTipPercentageDistribution(Object.keys(response).map((key) => ({
        //             name: key,
        //             Rides: response[key],
        //         })))
        //     } catch (error) {
        //         if (axios.isAxiosError(error)) console.error(error.message);
        //     }
        // };
        setLoading(true);
        // fetchTipPercentageDistribution();
        setLoading(false);
    }, []);

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
            {/* <span>Based on 161,843,930 rides</span> */}
            <Box sx={{ width: '100%' }}>
                <Tabs value={value} onChange={handleChange} aria-label="nav tabs example">
                    <Tab label="Time series statistics" onClick={() => router.push("./statistics/time")} />
                    <Tab label="Financial statistics" onClick={() => router.push("./statistics/financial")} />
                    {/* <Link href="/spam">Page Three</Link> */}
                </Tabs>
            </Box>
            <div className='h-full w-full flex flex-row flex-wrap'>
                {/* <ResponsiveContainer width="50%" height={400}>
                    <ScatterChart
                        margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                        }}
                    >
                        <CartesianGrid />
                        <XAxis type="number" dataKey="name" name="stature" unit="cm" />
                        <YAxis type="number" dataKey="Rides" name="weight" unit="kg" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter name="A school" data={tipPercentageDistribution} fill="#8884d8" />
                    </ScatterChart>
                </ResponsiveContainer> */}

                {/* TODO: NOTEPAD++ spisak */}
                {/* Tip percentage Distribution */}
                {/* <ResponsiveContainer width="50%" height="50%">
                    <LineChart
                        width={500}
                        height={300}
                        data={tipPercentageDistribution}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" scale="log" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Rides" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer> */}
            </div>

        </div>
    )
}