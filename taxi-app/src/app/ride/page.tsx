"use client"
import RideService from '@/services/RideService';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import dayjs from 'dayjs';
import { LoadingSpinner } from '@/components/common/loadingSpinner/loadingSpinner';

const RideMap = dynamic(() => import('../../components/rideMap/rideMap'), {
    ssr: false,
});


export default function Page() {
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams()
    const [ride, setRide] = useState<Ride>();
    useEffect(() => {
        const fetchRide = async () => {
            try {
                const lat = Number(searchParams.get('lat'));
                const lng = Number(searchParams.get('lng'));
                const pickupDate = dayjs(searchParams.get('pickup'))
                const dropoffDate = dayjs(searchParams.get('dropoff'))
                const { data: response, status } = await RideService.getRide(lat, lng, pickupDate, dropoffDate);
                setRide(response);
            } catch (error) {
                if (axios.isAxiosError(error)) console.error(error.message);
            }
        };
        setLoading(true);
        fetchRide();
        setLoading(false);
    }, []);
    return (

        <div className="min-h-screen items-center justify-between h-5/6 w-full bg-white">
            {loading && (
                <div className="flex flex-grow justify-center absolute top-1/2 left-1/2 z-10 rounded-lg">
                    <div className="flex flex-col justify-center">
                        <LoadingSpinner />
                    </div>
                </div>
            )}
            {ride && <div className="bg-slate-200 p-4 rounded-md shadow text-slate-800 mb-5">
                <h2 className="text-2xl font-semibold w-full flex justify-center
                 border-2 border-slate-100 shadow-lg mb-5">Ride Details</h2>
                <div className='grid grid-cols-3 gap-4 w-full justify-items-center'>
                    <div>
                        <div className='text-lg'>
                            <p><strong>Cab Type:</strong> {ride.cabType}</p>
                            <p><strong>Vendor ID:</strong> {ride.vendorId}</p>
                            <p><strong>Pickup Date and Time:</strong>
                                {dayjs(ride.pickupDatetime).format('DD-MM-YYYY ss:mm:HH')}</p>
                            <p><strong>Dropoff Date and Time:</strong>
                                {dayjs(ride.dropoffDatetime).format('DD-MM-YYYY ss:mm:HH')}</p>
                            <p><strong>Rate Code ID:</strong> {ride.rateCodeId}</p>
                            <p><strong>Trip Type:</strong> {ride.tripType}</p>
                        </div>
                    </div>
                    <div className='text-lg'>
                        <p><strong>Passenger Count:</strong> {ride.passengerCount}</p>
                        <p><strong>Trip Distance:</strong> {ride.tripDistance}</p>
                        <p><strong>Fare Amount:</strong> {ride.fareAmount}</p>
                        <p><strong>Tip Amount:</strong> {ride.tipAmount}</p>
                        <p><strong>Improvement Surcharge:</strong> {ride.improvementSurcharge}</p>
                        <p><strong>Total Amount:</strong> {ride.totalAmount}</p>
                        <p><strong>Payment Type:</strong> {ride.paymentType}</p>
                    </div>
                    <div className='text-lg'>
                        <p><strong>Pickup Latitude:</strong> {ride.pickupLatitude}</p>
                        <p><strong>Pickup Longitude:</strong> {ride.pickupLongitude}</p>
                        <p><strong>Dropoff Latitude:</strong> {ride.dropoffLatitude}</p>
                        <p><strong>Dropoff Longitude:</strong> {ride.dropoffLongitude}</p>
                        <p><strong>Pickup Geohash:</strong> {ride.pickupGeohash}</p>
                    </div>
                </div>
            </div>}
            <div style={{ height: "350px" }} >
                {ride && <RideMap ride={ride} />}
            </div>
        </div>
    )
}