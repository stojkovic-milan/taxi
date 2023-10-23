import { NextResponse } from 'next/server'

export async function GET() {
    const res = await fetch(`${process.env.QUESTDB_REST_URL}?query=SELECT
        CAST(pickup_geohash as geohash(5c)) as broad_geohash,COUNT(*) AS ride_count
        FROM trips GROUP BY broad_geohash ORDER BY ride_count DESC LIMIT 3`,
        {
            headers: {
                'Authorization': 'Basic ' + btoa(process.env.QUESTDB_REST_USER + ":" + process.env.QUESTDB_REST_PASS),
            },
        })
    const data = await res.json()
    const response = data.dataset
    return NextResponse.json(response)
}