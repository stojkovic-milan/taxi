import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server'

export async function GET(req: NextApiRequest) {

    const url = new URL(req.url as string)

    const query = `
    (SELECT
        datediff('m', pickup_datetime, dropoff_datetime) AS ride_length_minutes,
        COUNT(*) AS ride_count
      FROM
        trips
      GROUP BY
        ride_length_minutes)
      WHERE ride_count>2
      Order By
        ride_length_minutes`;

    try {

        const res = await fetch(`${process.env.QUESTDB_REST_URL}?query=${encodeURIComponent(query)}`, {
            headers: {
                'Authorization': 'Basic ' + btoa(process.env.QUESTDB_REST_USER + ":" + process.env.QUESTDB_REST_PASS),
            },
        })
        const data = await res.json()
        const response = data.dataset
        return NextResponse.json(response)
    } catch (error) {
        console.error(error);
        // res.status(500).json({ error: 'Internal server error' });
    }
}