"use client"
import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, Pane, Popup, Rectangle, TileLayer } from "react-leaflet";
import L, { LatLng, latLng } from 'leaflet';
import firstIcon from '/public/first.png'
import secondIcon from '/public/second.png'
import thirdIcon from '/public/third.png'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { COLORS } from "@/app/statistics/page";

let firstMarkerIcon = L.icon({
    iconUrl: firstIcon.src,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
})
let secondMarkerIcon = L.icon({
    iconUrl: secondIcon.src,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
})
let thirdMarkerIcon = L.icon({
    iconUrl: thirdIcon.src,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
})
const icons = [firstMarkerIcon, secondMarkerIcon, thirdMarkerIcon]
interface GeohashMapProps {
    hashes: {
        pos: LatLng,
        count: number
    }[],
    metersInHash: number
}

export default function RideMap({ hashes, metersInHash }: GeohashMapProps) {
    const rectWidthMeters = metersInHash; // Width of the rectangle in meters
    const rectHeightMeters = metersInHash; // Height of the rectangle in meters
    // const centralPoint = { lat: 40.7504, lng: -73.9909 };

    const latScalingFactor = 1 / 111111; // 1 degree of latitude is approximately 111111 meters

    const rectWidthDegrees = rectWidthMeters * latScalingFactor;
    const rectHeightDegrees = rectHeightMeters * latScalingFactor;
    // const topLeftCorner = {
    //     lat: centralPoint.lat + rectHeightDegrees / 2,
    //     lng: centralPoint.lng - rectWidthDegrees / 2,
    //   };

    //   const topRightCorner = {
    //     lat: centralPoint.lat + rectHeightDegrees / 2,
    //     lng: centralPoint.lng + rectWidthDegrees / 2,
    //   };

    //   const bottomLeftCorner = {
    //     lat: centralPoint.lat - rectHeightDegrees / 2,
    //     lng: centralPoint.lng - rectWidthDegrees / 2,
    //   };

    //   const bottomRightCorner = {
    //     lat: centralPoint.lat - rectHeightDegrees / 2,
    //     lng: centralPoint.lng + rectWidthDegrees / 2,
    //   };
    return (
        <MapContainer className="h-full w-full" center={[hashes[0].pos.lat, hashes[0].pos.lng]}
            zoom={metersInHash < 1000 ? 15 : 12} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {hashes.length > 0
                &&
                hashes.map((hash, index) =>
                    <>
                        <Marker
                            // key={ride.pickupDatetime.getMilliseconds()}
                            position={[hash.pos.lat, hash.pos.lng]}
                            // title={ride.pickupDatetime.toLocaleString()}
                            icon={icons[index]}
                        >
                            <Popup>
                                <span>Rides Count: <strong>{hash.count}</strong></span>
                            </Popup>
                        </Marker>
                        <Pane name={`${index}-rect`}>
                            <Rectangle bounds={[
                                [hash.pos.lat + rectHeightDegrees / 2, hash.pos.lng - rectWidthDegrees / 2],
                                [hash.pos.lat - rectHeightDegrees / 2, hash.pos.lng + rectWidthDegrees / 2],
                            ]} pathOptions={{ color: `${COLORS[index]}` }}>
                                <Popup>
                                    <span>Rides Count: <strong>{hash.count}</strong></span>
                                </Popup>
                            </Rectangle>
                        </Pane>
                    </>
                )
            }

        </MapContainer >
    )
}