import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        const query = `
        SELECT
            passenger_count,
            AVG((tip_amount / (total_amount - tip_amount)) * 100) AS tip_percentage
        FROM
            trips
        WHERE
            fare_amount > 0
        GROUP BY
            passenger_count
        ORDER BY
            passenger_count`;

        // Send a GET request to QuestDB
        const response = await fetch(`${process.env.QUESTDB_REST_URL}?query=${encodeURIComponent(query)}`, {
            headers: {
                'Authorization': 'Basic ' + btoa(process.env.QUESTDB_REST_USER + ":" + process.env.QUESTDB_REST_PASS),
            },
        })

        if (!response.ok) {
            throw new Error('Failed to fetch data from QuestDB');
        }

        const data = await response.json();
        const dataset = data.dataset;

        return NextResponse.json(dataset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
