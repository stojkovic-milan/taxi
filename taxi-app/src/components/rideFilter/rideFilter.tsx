import RideService, { FilterCriteria } from "@/services/RideService";
import { Slider, FormControl, InputLabel, Select, OutlinedInput, MenuItem, Checkbox, ListItemText, SelectChangeEvent, Box, Tab, Tabs } from "@mui/material";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker"
import { QueryBuilderMaterial } from "@react-querybuilder/material";
import QueryBuilder, { Field, Option, RuleGroupType, formatQuery } from "react-querybuilder";
import dayjs from "dayjs";

interface RideFilterProps {
    filterCriteria: FilterCriteria
    setFilterCriteria: Dispatch<SetStateAction<FilterCriteria>>
    fetchFilteredRides: () => void
    query: RuleGroupType
    setQuery: Dispatch<SetStateAction<RuleGroupType>>
    filterType: FilterType
    setFilterType: Dispatch<SetStateAction<FilterType>>
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export const paymentTypes = [
    'Voided',
    'Unknown',
    'Cash',
    'Card',
    'No Charge',
    'Dispute',
];

export type FilterType = 'Basic' | 'Advanced'

export default function RideFilter({ filterCriteria, setFilterCriteria, fetchFilteredRides, query, setQuery, filterType, setFilterType }: RideFilterProps) {

    const [startDate, endDate] = filterCriteria.pickupDateTime ?? [null, null];

    const handleFilterSubmit = () => {
        fetchFilteredRides();
    };
    const handlePassengerCountChange = (event: Event, newValue: number | number[]) => {
        setFilterCriteria((prev) => ({ ...prev, passengerCount: newValue as number[] }));
    };
    const handleDistanceChange = (event: Event, newValue: number | number[]) => {
        setFilterCriteria((prev) => ({ ...prev, tripDistance: newValue as number[] }));
    };
    const handleFareChange = (event: Event, newValue: number | number[]) => {
        setFilterCriteria((prev) => ({ ...prev, fareAmount: newValue as number[] }));
    };
    const handlePaymentChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;
        setFilterCriteria((prev) =>
        ({
            ...prev,
            // On autofill we get a stringified value.
            paymentType:
                typeof value === 'string' ? value.split(',') : value,
        })
        );
    };
    const handlePickupDateChange = (update: [Date | null, Date | null]) => {
        setFilterCriteria((prev) => ({ ...prev, pickupDateTime: update }));
    };
    const handleFilterTypeChange = (event: React.SyntheticEvent, newValue: FilterType) => {
        setFilterType(newValue)
    }

    const cabTypes: Option[] = [
        { name: 'green', label: 'Green' },
        { name: 'yellow', label: 'Yellow' }
    ]
    const vendorIds: Option[] = [
        { name: 'VTS', label: 'VTS' },
        { name: 'CMT', label: 'CMT' }
    ]
    const rateCodeIds: Option[] = [
        { name: 'Negotiated fare', label: 'Negotiated fare' },
        { name: 'na', label: 'na' },
        { name: 'Newark', label: 'Newark' },
        { name: 'JFK', label: 'JFK' },
        { name: 'Standard rate', label: 'Standard rate' },
        { name: 'Group ride', label: 'Group ride' },
        { name: 'Nassay or Westchester', label: 'Nassay or Westchester' },

    ]
    const paymentTypes: Option[] = [
        { name: 'No Charge', label: 'No Charge' },
        { name: 'Cash', label: 'Cash' },
        { name: 'Card', label: 'Card' },
        { name: 'Voided', label: 'Voided' },
        { name: 'Unknown', label: 'Unknown' }
    ]
    //Query Builder
    const fields: Field[] = [
        {
            name: 'cab_type',
            label: 'Cab Type',
            valueEditorType: 'select',
            values: cabTypes,
            // operators: defaultOperators.filter((op) => op.name === '='),
        },
        {
            name: 'vendor_id',
            label: 'Vendor Id',
            valueEditorType: 'select',
            values: vendorIds,
        },
        { name: 'pickup_datetime', label: 'Pickup Datetime', inputType: 'date' },
        { name: 'dropoff_datetime', label: 'Dropoff Datetime', inputType: 'date' },
        {
            name: 'rate_code_Id',
            label: 'Rate Code Id',
            valueEditorType: 'select',
            values: rateCodeIds,
        },
        { name: 'pickup_latitude', label: 'Pickup Latitude', inputType: 'number' },
        { name: 'pickup_longitude', label: 'Pickup Longitude', inputType: 'number' },
        { name: 'dropoff_latitude', label: 'Dropoff Latitude', inputType: 'number' },
        { name: 'dropoff_longitude', label: 'Dropoff Longitude', inputType: 'number' },
        { name: 'passenger_count', label: 'Passenger Count', inputType: 'number' },
        { name: 'trip_distance', label: 'Trip Distance', inputType: 'number' },
        { name: 'fare_amount', label: 'Fare Amount', inputType: 'number' },
        { name: 'tip_amount', label: 'Tip Amount', inputType: 'number' },
        { name: 'improvement_surcharge', label: 'Improvement Surcharge', inputType: 'number' },
        { name: 'total_amount', label: 'Total Amount', inputType: 'number' },
        {
            name: 'payment_type',
            label: 'Payment Type',
            valueEditorType: 'select',
            values: paymentTypes,
        },
        { name: 'pickup_geohash', label: 'Pickup Geohash' },
    ];

    return (
        <div className='h-1/5 w-full bg-inherit mb-5 text-black'>
            <Box sx={{ width: '100%' }}>
                <Tabs value={filterType} onChange={handleFilterTypeChange} aria-label="nav tabs example">
                    <Tab label="Basic Filters" onClick={() => { }} value={"Basic"} />
                    <Tab label="Advanced Filters" onClick={() => { }} value={"Advanced"} />
                </Tabs>
            </Box>
            {filterType == "Basic" &&
                < div className="p-4 space-y-4">
                    <div className="flex space-x-4 gap-4">
                        <div className="w-1/6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Passenger count</label>
                            <Slider
                                min={1}
                                max={10}
                                getAriaLabel={() => 'Temperature range'}
                                value={filterCriteria.passengerCount}
                                onChange={handlePassengerCountChange}
                                valueLabelDisplay="auto"
                            />
                        </div>
                        <div className="w-1/6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Distance (miles)</label>
                            <Slider
                                min={0}
                                max={250}
                                getAriaLabel={() => 'Temperature range'}
                                value={filterCriteria.tripDistance}
                                onChange={handleDistanceChange}
                                valueLabelDisplay="auto"
                            />
                        </div>
                        <div className="w-1/6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Total Fare ($USD)</label>
                            <Slider
                                min={0}
                                max={1000}
                                getAriaLabel={() => 'Temperature range'}
                                value={filterCriteria.fareAmount}
                                onChange={handleFareChange}
                                valueLabelDisplay="auto"
                            />
                        </div>
                        <div className="w-1/6">
                            {/* <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label> */}
                            <FormControl
                                fullWidth>
                                <InputLabel id="demo-multiple-checkbox-label">Payment Type</InputLabel>
                                <Select
                                    color='primary'
                                    label="Payment Type"
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    value={filterCriteria.paymentType}
                                    onChange={handlePaymentChange}
                                    input={<OutlinedInput label="Tag" />}
                                    renderValue={(selected) => selected.join(', ')}
                                    MenuProps={MenuProps}
                                >
                                    {paymentTypes.map((type) => (
                                        <MenuItem key={type.name} value={type.name}>
                                            <Checkbox checked={(filterCriteria.paymentType?.indexOf(type.name) ?? -1) > -1} />
                                            <ListItemText primary={type.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <div className="w-1/6">
                            <label className="block text-sm font-medium text-gray-700 mb-0.5">Pickup Date Range</label>
                            <DatePicker
                                // placeholderText="Pickup Date Range"
                                className='h-8 rounded-md'
                                selectsRange={true}
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(update) => {
                                    handlePickupDateChange(update);
                                }}
                                isClearable={true}
                            />
                        </div>
                        <div>
                            <button
                                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none"
                                onClick={handleFilterSubmit}
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>}
            {filterType == "Advanced" &&
                <div>
                    <QueryBuilderMaterial>
                        <QueryBuilder
                            fields={fields}
                            query={query}
                            onQueryChange={q => setQuery(q)}
                            showNotToggle />
                    </QueryBuilderMaterial>
                    <div className="flex justify-between pt-1">
                        <span>
                            Resulting query:
                            <span>
                                <code>{formatQuery(query, 'sql')}</code>
                            </span>
                        </span>
                        <button
                            className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none"
                            onClick={handleFilterSubmit}
                        >
                            Apply Query
                        </button>
                    </div>
                </div>}
        </div >)
}