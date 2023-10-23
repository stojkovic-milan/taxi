import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server'

export async function GET(req: NextApiRequest) {

    const url = new URL(req.url as string)
    const hour = url.searchParams.get("hour")

    const query = `
    (SELECT
        pickup_geohash,
        EXTRACT(
        HOUR
        FROM
            pickup_datetime
        ) AS hour_of_day,
        COUNT(*) AS trip_count
    FROM
        trips
        WHERE EXTRACT(HOUR FROM pickup_datetime) = ${hour}
    GROUP BY
        hour_of_day,
        pickup_geohash)
    WHERE trip_count>2
    ORDER BY
        trip_count DESC
  `;

    const res = await fetch(`${process.env.QUESTDB_REST_URL}?query=${encodeURIComponent(query)}`, {
        headers: {
            'Authorization': 'Basic ' + btoa(process.env.QUESTDB_REST_USER + ":" + process.env.QUESTDB_REST_PASS),
        },
    })
    const data = await res.json()
    //@ts-ignore
    const response = data.dataset.map(row => [row[0], row[2]])
    // const response = data.dataset.map(row => [row[0], row[1]])
    return NextResponse.json(response)
}