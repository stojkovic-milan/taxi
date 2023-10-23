import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        const url = new URL(req.url as string)
        const startTime = url.searchParams.get("startTime");
        let sql =
            `SELECT
                'Total Number of Trips' AS statistic_name,
                count() AS statistic_value
            FROM
                realtime_test
            WHERE
                pickup_datetime > '${dayjs(startTime).toISOString()}'
            OR
                dropoff_datetime > '${dayjs(startTime).toISOString()}'
            UNION ALL
            SELECT
                'Total Revenue',
                sum(total_amount)
            FROM
                realtime_test
            WHERE
                pickup_datetime > '${dayjs(startTime).toISOString()}'
            OR
                dropoff_datetime > '${dayjs(startTime).toISOString()}'
            UNION ALL
            SELECT
                'Total Tip',
                sum(tip_amount)
            FROM
                realtime_test
            WHERE
                pickup_datetime > '${dayjs(startTime).toISOString()}'
            OR
                dropoff_datetime > '${dayjs(startTime).toISOString()}'
            UNION ALL
            SELECT
                'Average distance',
                avg(trip_distance)
            FROM
                realtime_test
            WHERE
                pickup_datetime > '${dayjs(startTime).toISOString()}'
            OR
                dropoff_datetime > '${dayjs(startTime).toISOString()}'
                `
        console.log(sql)

        const response = await fetch(`${process.env.QUESTDB_REST_URL}?query=${encodeURIComponent(sql)}`, {
            headers: {
                'Authorization': 'Basic ' + btoa(process.env.QUESTDB_REST_USER + ":" + process.env.QUESTDB_REST_PASS),
            },
        })
        if (!response.ok) {
            throw new Error('Failed to fetch data from QuestDB');
        }

        const data = await response.json();

        let dataset: any[][] = data.dataset;

        return NextResponse.json(dataset);
    } catch (error) {
        console.error(error);
        return NextResponse.json(error, { status: 500 });
    }
}
