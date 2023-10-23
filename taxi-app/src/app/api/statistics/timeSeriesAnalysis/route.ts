import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Define the queries for time-series analysis
        const monthlyAnalysisQuery = `
      SELECT
        EXTRACT(MONTH FROM pickup_datetime) AS month_number,
        COUNT(*) AS total_trips
      FROM trips
      GROUP BY month_number
      ORDER BY month_number;`;

        const dayOfWeekAnalysisQuery = `
      SELECT
        EXTRACT(DOW FROM pickup_datetime) AS day_of_week,
        COUNT(*) AS total_trips
      FROM trips
      GROUP BY day_of_week
      ORDER BY day_of_week;`;

        const hourOfDayAnalysisQuery = `
      SELECT
        EXTRACT(HOUR FROM pickup_datetime) AS hour_of_day,
        COUNT(*) AS total_trips
      FROM trips
      GROUP BY hour_of_day
      ORDER BY hour_of_day;`;



        // Execute the queries and retrieve the results
        const [monthlyAnalysis, dayOfWeekAnalysis, hourOfDayAnalysis] = await Promise.all([
            executeQuery(monthlyAnalysisQuery),
            executeQuery(dayOfWeekAnalysisQuery),
            executeQuery(hourOfDayAnalysisQuery),
        ]);

        // Prepare the result object
        const result = {
            monthlyAnalysis: monthlyAnalysis,
            dayOfWeekAnalysis: dayOfWeekAnalysis,
            hourOfDayAnalysis: hourOfDayAnalysis,
        };

        return NextResponse.json({ ...result });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Define an async function to execute the queries
async function executeQuery(query: string) {
    const response = await fetch(`${process.env.QUESTDB_REST_URL}?query=${query}`, {
        headers: {
            'Authorization': 'Basic ' + btoa(process.env.QUESTDB_REST_USER + ":" + process.env.QUESTDB_REST_PASS),
        },
    })

    if (!response.ok) {
        throw new Error('Failed to fetch data from QuestDB');
    }
    const data = await response.json();
    return data.dataset
}