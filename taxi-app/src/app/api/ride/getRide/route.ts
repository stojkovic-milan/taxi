import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        const url = new URL(req.url as string)
        const pickupDateTime = url.searchParams.get("pickupDateTime");
        const dropoffDateTime = url.searchParams.get("dropoffDateTime");
        const pickupLat = url.searchParams.get("pickupLat");
        const pickupLng = url.searchParams.get("pickupLng");

        let sql = `SELECT cab_type,
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
            FROM trips WHERE pickup_latitude = ${pickupLat} 
            AND pickup_longitude = ${pickupLng} 
            AND pickup_datetime = '${dayjs(pickupDateTime).toISOString()}' 
            AND dropoff_datetime = '${dayjs(dropoffDateTime).toISOString()}'`
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

        if (!dataset)
            throw new Error('Failed to fetch data from QuestDB');

        let ride = dataset[0]
        let retVal: Ride = {
            cabType: ride[0],
            vendorId: ride[1],
            pickupDatetime: ride[2],
            dropoffDatetime: ride[3],
            rateCodeId: ride[4],
            pickupLatitude: ride[5],
            pickupLongitude: ride[6],
            dropoffLatitude: ride[8],
            dropoffLongitude: ride[7],
            passengerCount: ride[9],
            tripDistance: ride[10],
            fareAmount: ride[11],
            tipAmount: ride[12],
            improvementSurcharge: ride[13],
            totalAmount: ride[14],
            paymentType: ride[15],
            tripType: ride[16],
            pickupGeohash: ride[17]
        }

        return NextResponse.json(retVal);
    } catch (error) {
        console.error(error);
        return NextResponse.json(error, { status: 500 });
    }
}
