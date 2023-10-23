import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        const query = `
        SELECT
            CASE
                WHEN ROUND(tip_amount, 2) = 0.00 THEN 0
                ELSE ROUND((tip_amount / (total_amount - tip_amount)) * 100, -1)
            END AS tip_percentage_range,
        COUNT(*) AS tip_percentage_count
        FROM
            trips
        WHERE
            total_amount - tip_amount > 0
        GROUP BY
            tip_percentage_range
        ORDER BY
            tip_percentage_range
    `;

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
        const dataset = data.dataset.slice(1);
        return NextResponse.json([...dataset]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
