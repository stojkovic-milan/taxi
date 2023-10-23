import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        const url = new URL(req.url as string)
        const query = url.searchParams.get("query")
        const pageNumber = url.searchParams.get("pageNumber");
        const pageSize = url.searchParams.get("pageSize");
        let selectAll = `SELECT cab_type,
                vendor_id,
                pickup_datetime,
                dropoff_datetime,
                rate_code_id,
                pickup_latitude,
                pickup_longitude,
                dropoff_latitude,
                dropoff_longitude,
                passenger_count,
                trip_distance,
                fare_amount,
                tip_amount,
                improvement_surcharge,
                total_amount,
                payment_type,
                trip_type,
                pickup_geohash 
            FROM trips WHERE ${query}`
        let sql = selectAll

        let offset = null
        if (pageNumber != null && pageSize != null)
            offset = Number(pageNumber) * Number(pageSize);


        if (offset != null)
            sql += ` LIMIT ${offset}, ${(Number(pageNumber) + 1) * Number(pageSize)}`;

        const response = await fetch(`${process.env.QUESTDB_REST_URL}?query=${encodeURIComponent(sql)}`, {
            headers: {
                'Authorization': 'Basic ' + btoa(process.env.QUESTDB_REST_USER + ":" + process.env.QUESTDB_REST_PASS),
            },
        })
        if (!response.ok) {
            throw new Error('Failed to fetch data from QuestDB');
        }

        const data = await response.json();
        const dataset: any[][] = data.dataset;
        // console.log(dataset)


        let countSql = `SELECT COUNT(*) FROM trips WHERE ${query}`

        const countResponse = await fetch(`${process.env.QUESTDB_REST_URL}?query=${encodeURIComponent(countSql)}`, {
            headers: {
                'Authorization': 'Basic ' + btoa(process.env.QUESTDB_REST_USER + ":" + process.env.QUESTDB_REST_PASS),
            },
        })
        // console.log(response)
        if (!countResponse.ok) {
            throw new Error('Failed to count data from QuestDB');
        }
        const countData = await countResponse.json();
        const countDataset = countData.dataset;

        let retVal: RidesFilterResponseDTO = {
            rides: dataset.map(ride =>
            ({
                cabType: ride[0],
                vendorId: ride[1],
                pickupDatetime: ride[2],
                dropoffDatetime: ride[3],
                rateCodeId: ride[4],
                pickupLatitude: ride[5],
                pickupLongitude: ride[6],
                dropoffLatitude: ride[7],
                dropoffLongitude: ride[8],
                passengerCount: ride[9],
                tripDistance: ride[10],
                fareAmount: ride[11],
                tipAmount: ride[12],
                improvementSurcharge: ride[13],
                totalAmount: ride[14],
                paymentType: ride[15],
                tripType: ride[16],
                pickupGeohash: ride[17]
            })),
            totalCount: countDataset[0]
        }

        return NextResponse.json(retVal);
    } catch (error) {
        console.error(error);
        return NextResponse.json(error, { status: 500 });
    }
}
