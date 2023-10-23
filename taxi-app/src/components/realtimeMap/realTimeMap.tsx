"use client"
import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from 'leaflet';
import inProgressIcon from '/public/rideInProgress.png'
import doneIcon from '/public/rideDone.png'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useMemo } from "react";

let rideInProgressIcon = L.icon({
    iconUrl: inProgressIcon.src,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
})
let rideDoneIcon = L.icon({
    iconUrl: doneIcon.src,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
})

interface RealTiemMapProps {
    rides: Ride[]
}

export default function RealTimeMap({ rides }: RealTiemMapProps) {

    //Testing memoization
    const StaticPointMarkers = (rides: Ride[]) => {
        return useMemo(() => (rides).map((ride, index) => (
            <Marker
                key={index}
                position={[ride.pickupLongitude, ride.pickupLatitude]}
                icon={ride.dropoffDatetime ? rideDoneIcon : rideInProgressIcon}
            >
                <Popup >
                    <p><strong>Status: </strong>{ride.dropoffDatetime ? 'Completed' : 'In progress'}</p>
                    <p><strong>Pickup: </strong>{dayjs(ride.pickupDatetime).toString()}</p>
                    <p><strong>Passenger Count: </strong>{ride.passengerCount}</p>
                    {ride.dropoffDatetime &&
                        <>
                            <p><strong>Dropoff: </strong>{dayjs(ride.dropoffDatetime).toString()}</p>
                            <p><strong>Tip Amount: </strong>${ride.tipAmount}</p>
                            <p><strong>Total Amount: </strong>${ride.totalAmount}</p>
                            <p><strong>Payment Type: </strong>{ride.paymentType}</p>
                            <p><strong>Trip Distance: </strong>{ride.tripDistance}mi</p>
                        </>}
                </Popup></Marker>
        )), [rides])
    }
    return (
        <MapContainer center={[40.730610, -73.935242]} zoom={13} scrollWheelZoom={true} className="w-full h-full"
            preferCanvas={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup
                chunkedLoading
            >
                {rides.length > 0 && StaticPointMarkers(rides)}
            </MarkerClusterGroup>
        </MapContainer >
    )
}