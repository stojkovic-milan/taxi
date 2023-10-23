"use client"
import RideService, { FilterCriteria, PaginationCriteria } from '@/services/RideService';
import { Accordion, AccordionSummary, Typography, AccordionDetails, Pagination } from '@mui/material';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RideFilter, { FilterType } from '@/components/rideFilter/rideFilter';
import { initialFilterCriteria } from '../list/page';
import { LoadingSpinner } from '@/components/common/loadingSpinner/loadingSpinner';
import { RuleGroupType, formatQuery } from 'react-querybuilder';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

const Map = dynamic(() => import('../../components/ridesMap/ridesMap'), {
    ssr: false,
});


export default function Page() {
    const [rides, setRides] = useState<Ride[]>([]);
    const [paginationModel, setPaginationModel] = useState<PaginationCriteria>({
        page: 0,
        pageSize: 1000,
    });
    const [loading, setLoading] = useState(true);
    const [filtered, setFiltered] = useState(false);
    const [rowCountState, setRowCountState] = useState<number>();
    const fetchRides = async (filtered: boolean, filterType: FilterType) => {
        try {
            const { data: response, status } = filterType == "Basic" ? await RideService.getRides(paginationModel,
                filtered ? filterCriteria : undefined)
                : await RideService.getRidesByQuery(paginationModel, formatQuery(query, 'sql'));
            setRides(response.rides);
            setRowCountState((prevRowCountState) =>
                response.totalCount !== undefined ? response.totalCount : prevRowCountState,
            );
            setLoading(false);
        } catch (error) {
            if (axios.isAxiosError(error)) console.error(error.message);
        }
    };
    useEffect(() => {
        setLoading(true);
        fetchRides(filtered, filterType);
    }, [paginationModel.page, paginationModel.pageSize]);

    const router = useRouter()

    const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>(initialFilterCriteria);
    const [query, setQuery] = useState<RuleGroupType>({
        combinator: 'and',
        rules: [
            { field: 'pickup_datetime', operator: '>=', value: dayjs("2015-01-01").format('YYYY-MM-DD') },
            { field: 'dropoff_datetime', operator: '<=', value: dayjs("2016-01-01").format('YYYY-MM-DD') },
        ],
    });
    const [filterType, setFilterType] = useState<FilterType>('Basic')
    const [queryString, setQueryString] = useState("");

    const handleFilterSubmit = () => {
        if (!filtered) setFiltered(true)
        setLoading(true);
        fetchRides(true, filterType);
    }

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPaginationModel(prev => ({ ...prev, page: value - 1 }));
    };

    return (
        <div className="min-h-screen items-center justify-between p-2 h-screen bg-white">
            {loading && (
                <div className="flex flex-grow justify-center absolute top-1/2 left-1/2 z-10 w-24 h-24 bg-white shadow-lg rounded-lg">
                    <div className="flex flex-col justify-center">
                        <LoadingSpinner />
                    </div>
                </div>
            )}
            <Accordion className='mb-2'>
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
                        setFilterCriteria={setFilterCriteria}
                        query={query}
                        setQuery={setQuery}
                        filterType={filterType}
                        setFilterType={setFilterType}
                    />
                    {rowCountState &&
                        <Pagination count={Math.ceil(rowCountState / paginationModel.pageSize)}
                            color="primary" onChange={handlePageChange} />}

                </AccordionDetails>
            </Accordion>
            <div className='h-5/6 w-full'>
                {!loading && <Map rides={rides} />}
            </div>
        </div>
    )
}