"use client"
import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from 'leaflet';
import startIcon from '/public/start.png'
import destinationIcon from '/public/destination.png'
import MarkerClusterGroup from 'react-leaflet-cluster'

let startMarkerIcon = L.icon({
    iconUrl: startIcon.src,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
})
let destinationMarkerIcon = L.icon({
    iconUrl: destinationIcon.src,
    iconSize: [32, 32],
    iconAnchor: [10, 6]
})

interface RideMapProps {
    ride: Ride
}

export default function RideMap({ ride }: RideMapProps) {
    console.log(ride)
    return (
        <MapContainer className="h-full w-full" center={[(ride.pickupLongitude + ride.dropoffLongitude) / 2,
        (ride.pickupLatitude + ride.dropoffLatitude) / 2]}
            preferCanvas={true}
            zoom={15} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup
                chunkedLoading
            >
                {ride
                    &&
                    <>
                        <Marker
                            // key={ride.pickupDatetime.getMilliseconds()}
                            position={[ride.pickupLongitude, ride.pickupLatitude]}
                            // title={ride.pickupDatetime.toLocaleString()}
                            icon={startMarkerIcon}
                        >
                            <Popup>
                                <strong>Pickup</strong>
                            </Popup>
                        </Marker>
                        <Marker
                            // key={ride.pickupDatetime.getMilliseconds()}
                            position={[ride.dropoffLongitude, ride.dropoffLatitude]}
                            title={ride.pickupDatetime.toLocaleString()}
                            icon={destinationMarkerIcon}
                        >
                            <Popup>
                                <strong>Dropoff</strong>
                            </Popup>
                        </Marker>
                    </>
                }
            </MarkerClusterGroup>
        </MapContainer>
    )
}