"use client"
import RideService, { FilterCriteria, PaginationCriteria } from '@/services/RideService';
import { GridColDef, DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { LoadingSpinner } from '@/components/common/loadingSpinner/loadingSpinner';
import { Icon, Stack } from "@mui/material";

import { useRouter } from 'next/navigation'
import RideFilter, { FilterType, paymentTypes } from '@/components/rideFilter/rideFilter';
import { Field, QueryBuilder, RuleGroupType, formatQuery, defaultOperators } from 'react-querybuilder';
import { QueryBuilderMaterial } from '@react-querybuilder/material';
import 'react-querybuilder/dist/query-builder.css';
import type { Option } from 'react-querybuilder';
import dayjs from 'dayjs';


export const initialFilterCriteria: FilterCriteria = {
    pickupDateTime: [new Date('2008-01-01T00:00:00'), new Date('2019-01-01T00:00:00')],
    passengerCount: [1, 10],
    tripDistance: [0, 50],
    fareAmount: [0, 1000],
    paymentType: [...paymentTypes]
};



export default function Page() {
    const columns: GridColDef[] = [
        // { field: "id", headerName: "Id", flex: 1 },
        { field: "cabType", headerName: "Cab Type", flex: 1 },
        { field: "vendorId", headerName: "Vendor ID", flex: 1 },
        { field: "pickupDatetime", headerName: "Pickup Datetime", flex: 1 },
        { field: "dropoffDatetime", headerName: "Dropoff Datetime", flex: 1 },
        { field: "rateCodeId", headerName: "Rate Code ID", flex: 1 },
        { field: "pickupLatitude", headerName: "Pickup Latitude", flex: 1 },
        { field: "pickupLongitude", headerName: "Pickup Longitude", flex: 1 },
        { field: "dropoffLatitude", headerName: "Dropoff Latitude", flex: 1 },
        { field: "dropoffLongitude", headerName: "Dropoff Longitude", flex: 1 },
        { field: "passengerCount", headerName: "Passenger Count", flex: 1 },
        { field: "tripDistance", headerName: "Trip Distance", flex: 1 },
        { field: "fareAmount", headerName: "Fare Amount", flex: 1 },
        { field: "tipAmount", headerName: "Tip Amount", flex: 1 },
        { field: "improvementSurcharge", headerName: "Improvement Surcharge", flex: 1 },
        { field: "totalAmount", headerName: "Total Amount", flex: 1 },
        { field: "paymentType", headerName: "Payment Type", flex: 1 },
        { field: "tripType", headerName: "Trip Type", flex: 1 },
        {
            field: "actions",
            type: "actions",
            minWidth: 50,
            flex: 1,
            getActions: (params) => [
                <GridActionsCellItem
                    key={"info"}
                    icon={<Icon className="material-symbols-outlined">info</Icon>}
                    label="Info"
                    onClick={() => {
                        router.push(`/ride?pickup=${params.row.pickupDatetime}&dropoff=${params.row.dropoffDatetime}&lat=${params.row.pickupLatitude}&lng=${params.row.pickupLongitude}`)
                    }}
                />,
            ],
        }
    ];
    const [currentRows, setCurrentRows] = useState<Array<Ride & { id?: number }>
    >([]);
    const [paginationModel, setPaginationModel] = useState<PaginationCriteria>({
        page: 0,
        pageSize: 100,
    });
    const [loading, setLoading] = useState(true);
    const [filtered, setFiltered] = useState(false);
    const [rowCountState, setRowCountState] = useState<number>();
    const fetchRides = async (filtered: boolean, filterType: FilterType) => {
        try {
            const { data: response, status } = filterType == "Basic" ? await RideService.getRides(paginationModel,
                filtered ? filterCriteria : undefined)
                : await RideService.getRidesByQuery(paginationModel, formatQuery(query, 'sql'));
            setCurrentRows(response.rides.map((ride, i) => ({ ...ride, id: i })));
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

    // const cabTypes: Option[] = [
    //     { name: 'green', label: 'Green' },
    //     { name: 'yellow', label: 'Yellow' }
    // ]
    // const vendorIds: Option[] = [
    //     { name: 'VTS', label: 'VTS' },
    //     { name: 'CMT', label: 'CMT' }
    // ]
    // const rateCodeIds: Option[] = [
    //     { name: 'Negotiated fare', label: 'Negotiated fare' },
    //     { name: 'na', label: 'na' },
    //     { name: 'Newark', label: 'Newark' },
    //     { name: 'JFK', label: 'JFK' },
    //     { name: 'Standard rate', label: 'Standard rate' },
    //     { name: 'Group ride', label: 'Group ride' },
    //     { name: 'Nassay or Westchester', label: 'Nassay or Westchester' },

    // ]
    // const paymentTypes: Option[] = [
    //     { name: 'No Charge', label: 'No Charge' },
    //     { name: 'Cash', label: 'Cash' },
    //     { name: 'Card', label: 'Card' },
    //     { name: 'Voided', label: 'Voided' },
    //     { name: 'Unknown', label: 'Unknown' }
    // ]
    // //Query Builder
    // const fields: Field[] = [
    //     {
    //         name: 'cab_type',
    //         label: 'Cab Type',
    //         valueEditorType: 'select',
    //         values: cabTypes,
    //         // operators: defaultOperators.filter((op) => op.name === '='),
    //     },
    //     {
    //         name: 'vendor_id',
    //         label: 'Vendor Id',
    //         valueEditorType: 'select',
    //         values: vendorIds,
    //     },
    //     { name: 'pickup_datetime', label: 'Pickup Datetime', inputType: 'date' },
    //     { name: 'dropoff_datetime', label: 'Dropoff Datetime', inputType: 'date' },
    //     {
    //         name: 'rate_code_Id',
    //         label: 'Rate Code Id',
    //         valueEditorType: 'select',
    //         values: rateCodeIds,
    //     },
    //     { name: 'pickup_latitude', label: 'Pickup Latitude', inputType: 'number' },
    //     { name: 'pickup_longitude', label: 'Pickup Longitude', inputType: 'number' },
    //     { name: 'dropoff_latitude', label: 'Dropoff Latitude', inputType: 'number' },
    //     { name: 'dropoff_longitude', label: 'Dropoff Longitude', inputType: 'number' },
    //     { name: 'passenger_count', label: 'Passenger Count', inputType: 'number' },
    //     { name: 'trip_distance', label: 'Trip Distance', inputType: 'number' },
    //     { name: 'fare_amount', label: 'Fare Amount', inputType: 'number' },
    //     { name: 'tip_amount', label: 'Tip Amount', inputType: 'number' },
    //     { name: 'improvement_surcharge', label: 'Improvement Surcharge', inputType: 'number' },
    //     { name: 'total_amount', label: 'Total Amount', inputType: 'number' },
    //     {
    //         name: 'payment_type',
    //         label: 'Payment Type',
    //         valueEditorType: 'select',
    //         values: paymentTypes,
    //     },
    //     { name: 'pickup_geohash', label: 'Pickup Geohash' },
    // ];
    // const [query, setQuery] = useState<RuleGroupType>({
    //     combinator: 'and',
    //     rules: [
    //         { field: 'pickup_datetime', operator: '>=', value: dayjs("2015-01-01").format('YYYY-MM-DD') },
    //         { field: 'dropoff_datetime', operator: '<=', value: dayjs("2016-01-01").format('YYYY-MM-DD') },
    //     ],
    // });

    return (
        <div className="flex min-h-screen flex-col items-center justify-between p-10 pt-2 h-screen bg-white overflow-auto">
            {loading && (
                <div className="flex flex-grow justify-center absolute top-1/2 left-1/2 z-10 bg-white rounded-lg">
                    <div className="flex flex-col justify-center">
                        <LoadingSpinner />
                    </div>
                </div>
            )}
            <div className="h-full w-full bg-white">
                <div className='border-b-2 mb-2 border-slate-300 shadow-md h-42 text-black'>
                    <RideFilter
                        fetchFilteredRides={handleFilterSubmit}
                        filterCriteria={filterCriteria}
                        setFilterCriteria={setFilterCriteria}
                        query={query}
                        setQuery={setQuery}
                        filterType={filterType}
                        setFilterType={setFilterType}
                    />
                    {/* <QueryBuilderMaterial>
                        <QueryBuilder fields={fields} query={query} onQueryChange={q => setQuery(q)} />
                    </QueryBuilderMaterial>
                    <h4>
                        SQL as result of <code>formatQuery(query, 'sql')</code>:
                    </h4>
                    <pre>{formatQuery(query, 'sql')}</pre> */}
                </div>
                <div className='overflow-auto h-3/4 shadow-md mb-4'>
                    <DataGrid
                        className='h-full'
                        // apiRef={friRef}
                        rowHeight={40}
                        // columnHeaderHeight={70}
                        density="compact"
                        // initialState={{
                        //     sorting: {
                        //         sortModel: [{ field: "number", sort: "asc" }],
                        //     },
                        // }}
                        // sortingMode="server"
                        // onSortModelChange={}
                        slots={{
                            noRowsOverlay: () => (
                                <Stack height="100%" alignItems="center" justifyContent="center">
                                    {loading ? "" : "No rides match filter criteria"}
                                </Stack>
                            )
                        }}
                        pagination
                        paginationModel={paginationModel}
                        pageSizeOptions={[50, 100]}
                        paginationMode='server'
                        onPaginationModelChange={setPaginationModel}
                        rows={currentRows}
                        rowCount={rowCountState}
                        columns={columns}
                        disableColumnMenu
                    />
                </div>
            </div>
        </div>
    )
}