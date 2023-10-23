import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server'

export async function GET(req: NextApiRequest) {
    // const query = `
    // SELECT
    //     'Total Number of Trips' AS statistic_name,
    //     COUNT(*) AS statistic_value
    // FROM
    //     trips
    // UNION ALL
    // SELECT
    //     'Average Total Amount',
    //     '$' || AVG(total_amount)
    // FROM
    //     trips
    // UNION ALL
    // SELECT
    //     'Max Total Amount',
    //     '$' || MAX(total_amount)
    // FROM
    //     trips
    // UNION ALL
    // SELECT
    //     'Average Tip Amount',
    //     '$' || AVG(tip_amount)
    // FROM
    //     trips
    // UNION ALL
    // SELECT
    //     'Average Tip Percentage',
    //     AVG(tip_percentage)::TEXT || '%' AS average_tip_percentage
    // FROM
    // (
    //     SELECT
    //     (tip_amount / (total_amount - tip_amount)) * 100 AS tip_percentage
    //     FROM
    //     trips
    //     WHERE
    //     fare_amount > 0
    // )
    // UNION ALL
    // SELECT
    //     'Max Tip Amount',
    //     '$' || MAX(tip_amount)
    // FROM
    //     trips
    // UNION ALL
    // SELECT
    //     'Most Common Payment Type',
    //     payment_type
    // FROM
    //     (
    //         SELECT
    //             payment_type,
    //             COUNT(*) AS payment_type_count
    //         FROM
    //             trips
    //         GROUP BY
    //             payment_type
    //         ORDER BY
    //             payment_type_count DESC
    //         LIMIT 1
    //     )
    // UNION ALL
    // SELECT
    //     'Total Earnings',
    //     '$'|| SUM(total_amount) / 1000000::TEXT || ' Mill.'
    // FROM
    //     trips
    // UNION ALL
    // SELECT
    //     'Average Trip Time',
    //     AVG(datediff('m', pickup_datetime, dropoff_datetime))::TEXT || ' minutes.'
    // FROM
    //     trips
    // UNION ALL
    // SELECT
    //     'Average Distance',
    //     AVG(trip_distance)::TEXT || ' mi'
    // FROM
    //     trips
    // UNION ALL
    // SELECT
    //     'Max Distance',
    //     MAX(trip_distance)::TEXT || ' mi'
    // FROM
    //     trips
    // UNION ALL
    // SELECT
    //     'Most Common Rate',
    //     rate_code_id
    // FROM
    //     (
    //         SELECT
    //             rate_code_id,
    //             COUNT(*) AS rate_code_count
    //         FROM
    //             trips
    //         GROUP BY
    //             rate_code_id
    //         ORDER BY
    //             rate_code_count DESC
    //         LIMIT 1
    //     )
    // `;
    const query1 = `
    SELECT
        'Total Number of Trips' AS statistic_name,
        COUNT(*) AS statistic_value
    FROM
        trips
    UNION ALL
    SELECT
        'Average Total Amount',
        '$' || AVG(total_amount)
    FROM
        trips
    UNION ALL
    SELECT
        'Max Total Amount',
        '$' || MAX(total_amount)
    FROM
        trips
    UNION ALL
    SELECT
        'Average Tip Amount',
        '$' || AVG(tip_amount)
    FROM
        trips
    UNION ALL
    SELECT
        'Average Tip Percentage',
        AVG(tip_percentage)::TEXT || '%' AS average_tip_percentage
    FROM
    (
        SELECT
        (tip_amount / (total_amount - tip_amount)) * 100 AS tip_percentage
        FROM
        trips
        WHERE
        fare_amount > 0
    )
    UNION ALL
    SELECT
        'Max Tip Amount',
        '$' || MAX(tip_amount)
    FROM
        trips
    `
    const query2 =
        `
    SELECT
        'Most Common Payment Type',
        payment_type
    FROM
        (
            SELECT
                payment_type,
                COUNT(*) AS payment_type_count
            FROM
                trips
            GROUP BY
                payment_type
            ORDER BY
                payment_type_count DESC
            LIMIT 1
        )
    UNION ALL
    SELECT
        'Total Earnings',
        '$'|| SUM(total_amount) / 1000000::TEXT || ' Mill.'
    FROM
        trips
    UNION ALL
    SELECT
        'Average Trip Time',
        AVG(datediff('m', pickup_datetime, dropoff_datetime))::TEXT || ' minutes.'
    FROM
        trips
    UNION ALL
    SELECT
        'Average Distance',
        AVG(trip_distance)::TEXT || ' mi'
    FROM
        trips
    UNION ALL
    SELECT
        'Max Distance',
        MAX(trip_distance)::TEXT || ' mi'
    FROM
        trips
    UNION ALL
    SELECT
        'Most Common Rate',
        rate_code_id
    FROM
        (
            SELECT
                rate_code_id,
                COUNT(*) AS rate_code_count
            FROM
                trips
            GROUP BY
                rate_code_id
            ORDER BY
                rate_code_count DESC
            LIMIT 1
        )
    `
    let response: [] = []
    const executeQuery = async (query: string) => {
        // console.log('QUERY: '+encodeURIComponent(query))
        const res = await fetch(`${process.env.QUESTDB_REST_URL}?query=${encodeURIComponent(query)}`, {
            headers: {
                'Authorization': 'Basic ' + btoa(process.env.QUESTDB_REST_USER + ":" + process.env.QUESTDB_REST_PASS),
            },
        })
        const data = await res.json()
        const dataset = data.dataset
        //@ts-ignore
        response.push(...dataset)
    }
    try {

        await Promise.all([executeQuery(query1), executeQuery(query2)])
        return NextResponse.json(response)
    } catch (error) {
        console.error(error);
        // res.status(500).json({ error: 'Internal server error' });
    }
}