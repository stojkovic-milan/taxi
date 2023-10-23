import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        const url = new URL(req.url as string)
        const reqTime = url.searchParams.get("reqTime");
        // const prevTime = url.searchParams.get("prevTime");
        // const pickupLat = url.searchParams.get("pickupLat");
        // const pickupLng = url.searchParams.get("pickupLng");
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
            FROM realtime_test
            WHERE
                pickup_datetime > '${dayjs(reqTime).toISOString()}'
            OR
                dropoff_datetime > '${dayjs(reqTime).toISOString()}'
                `
        let actualTime;
        let dataset: any[][]

        const fetchRides = async () => {
            const response = await fetch(`${process.env.QUESTDB_REST_URL}?query=${encodeURIComponent(sql)}`, {
                headers: {
                    'Authorization': 'Basic ' + btoa(process.env.QUESTDB_REST_USER + ":" + process.env.QUESTDB_REST_PASS),
                },
            })
            if (!response.ok) {
                throw new Error('Failed to fetch data from QuestDB');
            }

            const data = await response.json();

            dataset = data.dataset;
            // if (dataset.length > 0)
            //     clearInterval(fetchIntervalId)
        }
        //Duplicate immediate requests and resposnes
        // while (true) {
        //     actualTime = dayjs()
        //     await fetchRides()
        //     if (dataset.length > 0)
        //         break;
        //     else
        //         await new Promise(r => setTimeout(r, 3000));
        // }
        // let fetchIntervalId = setInterval(fetchRides, 10000);

        while (true) {
            await new Promise(r => setTimeout(r, 1500));
            actualTime = dayjs()
            await fetchRides()
            if (dataset.length > 0)
                break;
        }

        let retVal: RealTimeResponseDTO = {
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
            //TODO: Adjust by -1 second offset for latency?
            reqTime: actualTime.toDate()
        }
        return NextResponse.json(retVal);
    } catch (error) {
        console.error(error);
        return NextResponse.json(error, { status: 500 });
    }
}
