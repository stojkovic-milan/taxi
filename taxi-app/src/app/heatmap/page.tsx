"use client"
import RideService, { FilterCriteria, PaginationCriteria } from '@/services/RideService';
import { Accordion, AccordionSummary, Typography, AccordionDetails, Pagination, Box, Tab, Tabs, Slider, Switch, Grid } from '@mui/material';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RideFilter from '@/components/rideFilter/rideFilter';
import { initialFilterCriteria } from '../list/page';
import StatisticsService from '@/services/StatisticsService';
import { LoadingSpinner } from '@/components/common/loadingSpinner/loadingSpinner';

const HeatMap = dynamic(() => import('../../components/heatmap/heatmap'), {
    ssr: false,
});


export default function Page() {
    const [heatpoints, setHeatpoints] = useState<[[string, number]]>();
    const [rowCountState, setRowCountState] = useState<number>();
    const [loading, setLoading] = useState(true);
    const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>(initialFilterCriteria);
    const [paginationModel, setPaginationModel] = useState<PaginationCriteria>({
        page: 0,
        pageSize: 500,
    });
    const [hourlyHeatmap, setHourlyHeatmap] = useState(false)
    const [hour, setHour] = useState(13);
    useEffect(() => {
        // const fetchRides = async () => {
        //     try {
        //         const { data: response, status } = await RideService.getRides(paginationModel);
        //         // setHeatpoints(response.rides);
        //         setRowCountState((prevRowCountState) =>
        //             response.totalCount !== undefined ? response.totalCount : prevRowCountState,
        //         );
        //     } catch (error) {
        //         if (axios.isAxiosError(error)) console.error(error.message);
        //     }
        // };
        const fetchHeatmapInfo = async () => {
            try {
                const { data: response, status } = hourlyHeatmap ? await StatisticsService.getHeatMapHourlyStatistics(hour)
                    : await StatisticsService.getHeatMapStatistics();
                setHeatpoints(response)
                setLoading(false)
            } catch (error) {
                if (axios.isAxiosError(error)) console.error(error.message);
            }
        };

        setLoading(true);
        Promise.resolve(fetchHeatmapInfo()).then(() => setLoading(false))
    }, [paginationModel.page, hourlyHeatmap, hour]);

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

    // const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    //     setPaginationModel(prev => ({ ...prev, page: value - 1 }));
    // };

    const handleHeatmapTypeChange = (event: React.SyntheticEvent, newValue: boolean) => {
        setHourlyHeatmap(newValue)
    }
    function valuetext(value: number) {
        return `${value}h`;
    }
    const marks =
        [0, 3, 6, 9, 12, 15, 18, 21, 23].map(num => ({ value: num, label: `${num}h` }))

    return (
        <div className="min-h-screen items-center justify-between p-2 h-screen bg-white">
            {/* <Accordion className='mb-2'>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    {<Typography>{"Filter rides"}{rowCountState &&
                        `:\t\t${paginationModel.pageSize * paginationModel.page + 1}-${paginationModel.pageSize * (paginationModel.page + 1) + 1}  of ${rowCountState}`}
                    </Typography>}
                </AccordionSummary>
                <AccordionDetails className='bg-white'>
                    <RideFilter
                        fetchFilteredRides={handleFilterSubmit}
                        filterCriteria={filterCriteria}
                        setFilterCriteria={setFilterCriteria} />
                    {rowCountState &&
                        <Pagination count={Math.ceil(rowCountState / paginationModel.pageSize)}
                            color="primary" onChange={handlePageChange} />}

                </AccordionDetails>
            </Accordion> */}
            <div className='h-full w-full'>
                {loading && (
                    <div className="flex flex-grow justify-center absolute top-1/2 left-1/2 z-10 w-24 h-24 bg-white shadow-lg rounded-lg">
                        <div className="flex flex-col justify-center">
                            <LoadingSpinner />
                        </div>
                    </div>
                )}
                <div className='flex justify-between h-16 px-2 pt-1 border-2 border-blue-400 shadow-md mb-2 text-red-900 items-center'>
                    {/* <Box sx={{ width: '40%' }}>
                        <Tabs value={hourlyHeatmap} onChange={handleHeatmapTypeChange} aria-label="nav tabs example">
                            <Tab label="Basic Heatmap" onClick={() => { }} value={false} />
                            <Tab label="Hourly Heatmap" onClick={() => { }} value={true} />
                        </Tabs>
                    </Box> */}
                    <Grid component="label" container alignItems="center" spacing={1}>
                        <Grid color={'blue'} item>General</Grid>
                        <Grid item>
                            <Switch
                                size='medium'
                                checked={hourlyHeatmap} // relevant state for your case
                                onChange={handleHeatmapTypeChange} // relevant method to handle your change
                            // value="checked" // some value you need
                            />
                        </Grid>
                        <Grid color={'blue'} item>Hourly</Grid>
                    </Grid>

                    {hourlyHeatmap &&
                        <div className='w-2/3 pr-5 flex gap-3'>
                            <span>Hour:</span>
                            <Slider
                                color='primary'
                                aria-label="HourOfDay"
                                value={hour}
                                onChange={(ev, newVal) => setHour(newVal)}
                                defaultValue={13}
                                getAriaValueText={valuetext}
                                valueLabelFormat={valuetext}
                                valueLabelDisplay="auto"
                                size='medium'
                                step={1}
                                marks={marks}
                                min={0}
                                max={23}
                            />
                        </div>}
                </div>
                {!loading && <HeatMap points={heatpoints} />}
            </div>
        </div>
    )
}