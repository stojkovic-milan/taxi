import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
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
            FROM trips WHERE 1=1`
        let sql = selectAll
        const url = new URL(req.url as string)
        const pickupDateFrom = url.searchParams.get("pickupDateFrom");
        const pickupDateTo = url.searchParams.get("pickupDateTo");
        const vendorId = url.searchParams.get("vendorId");
        const passengerCountFrom = url.searchParams.get("passengerCountFrom");
        const passengerCountTo = url.searchParams.get("passengerCountTo");
        const cabType = url.searchParams.get("cabType");
        const tripDistanceFrom = url.searchParams.get("tripDistanceFrom");
        const tripDistanceTo = url.searchParams.get("tripDistanceTo");
        const congestionSurcharge = url.searchParams.get("congestionSurcharge");
        const paymentType = url.searchParams.get("paymentType");
        const totalAmountFrom = url.searchParams.get("totalAmountFrom");
        const totalAmountTo = url.searchParams.get("totalAmountTo");
        const tripType = url.searchParams.get("tripType");
        const pageNumber = url.searchParams.get("pageNumber");
        const pageSize = url.searchParams.get("pageSize");

        let offset = null
        if (pageNumber != null && pageSize != null)
            offset = Number(pageNumber) * Number(pageSize);


        if (pickupDateFrom) {
            sql += ` AND pickup_datetime >= '${dayjs(pickupDateFrom).format('YYYY-MM-DD')}'`;
        }

        if (pickupDateTo) {
            sql += ` AND pickup_datetime <= '${dayjs(pickupDateTo).format('YYYY-MM-DD')}'`;
        }

        if (vendorId) {
            sql += ` AND vendor_id = ${vendorId}`;
        }

        if (passengerCountFrom) {
            sql += ` AND passenger_count >= ${passengerCountFrom}`;
        }

        if (passengerCountTo) {
            sql += ` AND passenger_count <= ${passengerCountTo}`;
        }

        if (cabType) {
            sql += ` AND cab_type = ${cabType}`;
        }

        if (tripDistanceFrom) {
            sql += ` AND trip_distance >= ${tripDistanceFrom}`;
        }

        if (tripDistanceTo) {
            sql += ` AND trip_distance <= ${tripDistanceTo}`;
        }

        if (totalAmountFrom) {
            sql += ` AND total_amount >= ${totalAmountFrom}`;
        }

        if (totalAmountTo) {
            sql += ` AND total_amount <= ${totalAmountTo}`;
        }

        if (congestionSurcharge) {
            sql += ` AND congestion_surcharge = ${congestionSurcharge}`;
        }
        if (paymentType) {
            let paymentTypes = (paymentType as string).split(',');
            // console.log(paymentTypes)
            let paymentTypesString = ""
            paymentTypes.forEach(p => {
                paymentTypesString += `'${p}',`
            });
            paymentTypesString = paymentTypesString.slice(0, -1)
            sql += ` AND payment_type IN (${paymentTypesString})`
        }
        if (tripType) {
            sql += ` AND trip_type = ${tripType}`;
        }
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

        let countQuery = sql.replace(selectAll, "");
        // console.log(countQuery)
        if (offset!=null)
            countQuery = countQuery.slice(0,countQuery.indexOf("LIMIT"));
        // console.log(countQuery)
        let countSql = `SELECT COUNT(*) FROM trips WHERE 1=1 ${countQuery}`
        // console.log(countSql)
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
