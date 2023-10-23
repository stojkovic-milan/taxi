"use client"
import RideService, { } from '@/services/RideService';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { LoadingSpinner } from '@/components/common/loadingSpinner/loadingSpinner';
import dayjs, { Dayjs } from 'dayjs';
import { useRouter } from 'next/navigation';
import StatisticsService from '@/services/StatisticsService';


const Map = dynamic(() => import('../../components/realtimeMap/realTimeMap'), {
    ssr: false,
});

export default function Page() {
    const [rides, setRides] = useState<Ride[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<[[string, number]]>()
    const fetching = useRef(false);
    const fetchStats = async (reqTime: Dayjs) => {
        const { data: response, status } = await StatisticsService.getRealTimeStats(reqTime);
        setStats(response)
    }

    const fetchRides = async () => {
        try {
            // let prevTime = undefined
            let reqTime = dayjs()
            let initTime = reqTime
            while (true) {
                const { data: response, status } = await RideService.getRealTimeRides(reqTime);
                if (status != axios.HttpStatusCode.Ok)
                    break;
                fetchStats(initTime)
                setRides(prev => {
                    let prevKeep = prev.filter(p => !p.dropoffDatetime
                        && !response.rides.find(r => r.pickupDatetime == p.pickupDatetime
                            && r.pickupLatitude == p.pickupLatitude
                            && r.pickupLongitude == p.pickupLongitude
                            && r.passengerCount == p.passengerCount)
                        || p.dropoffDatetime && !response.rides.find(r => r.pickupDatetime == p.pickupDatetime
                            && r.pickupLatitude == p.pickupLatitude
                            && r.pickupLongitude == p.pickupLongitude
                            && r.passengerCount == p.passengerCount)
                    )
                    return ([...prevKeep, ...response.rides])
                });
                reqTime = dayjs(response.reqTime)
            }
        } catch (error) {
            if (axios.isAxiosError(error)) console.error(error.message);
        }
    };
    useEffect(() => {
        setLoading(true);
        if (!fetching.current) {
            fetching.current = true;
            fetchRides();
        }
        setLoading(false);
    }, []);

    //TODO: Add clear rides button to clear states

    const router = useRouter()
    return (
        <div className="min-h-screen items-center justify-between p-2 h-screen bg-white">
            {loading && (
                <div className="flex flex-grow justify-center absolute top-1/2 left-1/2 z-10 w-24 h-24 bg-white shadow-lg rounded-lg">
                    <div className="flex flex-col justify-center">
                        <LoadingSpinner />
                    </div>
                </div>
            )}
            <div className='h-full w-full'>
                {!loading && <Map rides={rides} />}
            </div>
            {stats?.length > 0 && <div className='h-1/6 w-1/6 absolute top-20 right-3 bg-blue-400 z-50 bg-opacity-50 text-black p-4 text-xl'>
                <p className='text-2xl'><strong>Realtime statistics</strong></p>
                <p>Number of rides: <strong>{stats[0][1]}</strong></p>
                <p>Total revenue: <strong>${Math.round(stats[1][1]*100)/100}</strong></p>
                <p>Total tip amount: <strong>${Math.round(stats[2][1]*100)/100}</strong></p>
                <p>Average Distance: <strong>{Math.round(stats[3][1]*100)/100}mi</strong></p>
            </div>}
        </div>
    )
}