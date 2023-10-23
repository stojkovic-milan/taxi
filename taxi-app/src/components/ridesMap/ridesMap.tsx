"use client"
import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import pinIcon from '/public/pin64.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import MarkerClusterGroup from 'react-leaflet-cluster'
import { Button, Icon } from "@mui/material";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

//Icon missing fix

let DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src,
    iconSize: [20, 20],
    iconAnchor: [10, 20]
});

let pinMarkerIcon = L.icon({
    iconUrl: pinIcon.src,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
})

interface RidesMapProps {
    rides: Ride[]
}

export default function RidesMap({ rides }: RidesMapProps) {
    //Icon missing fix
    const router = useRouter()
    L.Marker.prototype.options.icon = pinMarkerIcon;
    return (
        <MapContainer center={[40.730610, -73.935242]} zoom={13} scrollWheelZoom={true} className="w-full h-full">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup
                chunkedLoading
            >
                {rides.length > 0 && (rides).map((ride, index) => (
                    <Marker
                        key={index}
                        position={[ride.pickupLongitude, ride.pickupLatitude]}
                    // icon={defau}
                    >
                        <Popup>
                            <p><strong>Pickup: </strong>{dayjs(ride.pickupDatetime).toString()}</p>
                            {/* <div className="w-full "></div> */}
                            <Button variant="outlined" fullWidth startIcon={<Icon className="material-symbols-outlined">info</Icon>}
                                onClick={() =>
                                    router.push(`/ride?pickup=${ride.pickupDatetime}&dropoff=${ride.dropoffDatetime}&lat=${ride.pickupLatitude}&lng=${ride.pickupLongitude}`)}>
                                Ride Details
                            </Button>
                        </Popup></Marker>
                ))}
            </MarkerClusterGroup>
        </MapContainer>
    )
}