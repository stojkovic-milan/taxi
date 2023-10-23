import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        const query = `
        SELECT 
             SUM(total_amount) as total_total_amount,
             SUM(fare_amount) AS total_fare_amount,
             SUM(extra) AS total_extra,
             SUM(mta_tax) AS total_mta_tax,
             SUM(tip_amount) AS total_tip_amount,
             SUM(tolls_amount) AS total_tolls_amount,
             SUM(improvement_surcharge) AS total_improvement_surcharge
        FROM trips
    `;

        // Send a GET request to QuestDB
        const response = await fetch(`${process.env.QUESTDB_REST_URL}?query=${query}`, {
            headers: {
                'Authorization': 'Basic ' + btoa(process.env.QUESTDB_REST_USER + ":" + process.env.QUESTDB_REST_PASS),
            },
        })

        if (!response.ok) {
            throw new Error('Failed to fetch data from QuestDB');
        }

        const data = await response.json();
        const dataset = data.dataset[0];
        const totalAmount = dataset[0];

        const retVal: ChargeDistribution = {
            totalFare: dataset[1] / totalAmount * 100,
            totalExtra: dataset[2] / totalAmount * 100,
            totalMta: dataset[3] / totalAmount * 100,
            totalTips: dataset[4] / totalAmount * 100,
            totalTolls: dataset[5] / totalAmount * 100,
            totalImprovment: dataset[6] / totalAmount * 100,
        }

        return NextResponse.json({ ...retVal });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
