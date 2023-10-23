import { NextResponse } from 'next/server'

export async function GET() {
    const res = await fetch(`${process.env.QUESTDB_REST_URL}?query=SELECT pickup_geohash, COUNT(*) as total_rides FROM trips GROUP BY pickup_geohash ORDER BY total_rides DESC LIMIT 15000`, {
        headers: {
            'Authorization': 'Basic ' + btoa(process.env.QUESTDB_REST_USER + ":" + process.env.QUESTDB_REST_PASS),
        },
    })
    const data = await res.json()
    const response = data.dataset
    return NextResponse.json(response)
}