"use client"
import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer } from "react-leaflet";
import L, { HeatLatLngTuple, Map } from 'leaflet';
import { useEffect, useState } from "react";
import Geohash from 'latlon-geohash';
import "leaflet.heat";

interface HeatMapProps {
    points: [[string, number]] | undefined
}

export default function HeatMap({ points }: HeatMapProps) {
    const [map, setMap] = useState<Map | null>(null);

    useEffect(() => {
        if (map != null)

            if (points && points?.length > 0) {
                let filteredPoints = points.filter(p => p[0] != null && p[1] != null)
                let heatArray = filteredPoints.map(point => {
                    const latlong = Geohash.decode(point[0])
                    return [latlong.lat, latlong.lon, point[1] / points[0][1] * 10] as HeatLatLngTuple
                })
                let heat = L.heatLayer(heatArray, { radius: 25, minOpacity: 0 }).addTo(map)
            }
    }, [map, points])

    return (
        <MapContainer id="map" center={[40.730610, -73.935242]} zoom={12} scrollWheelZoom={true} className="w-full h-full" ref={setMap}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>
    )
}