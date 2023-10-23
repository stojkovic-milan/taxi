import { axiosInstance } from "@/components/utils/http";
import axios from "axios";
import { Dayjs } from "dayjs";

export interface PaginationCriteria {
    page: number,
    pageSize: number,
}

export interface FilterCriteria {
    pickupDateTime?: [Date | null, Date | null];
    passengerCount?: number[];
    tripDistance?: number[];
    fareAmount?: number[];
    paymentType?: string[];
    // Add more filter criteria as needed
}

class TaxiService {
    getRides(paging: PaginationCriteria, filter?: FilterCriteria) {
        let query = "";

        if (paging.page != null && paging.pageSize != null)
            query += `pageNumber=${paging.page}&pageSize=${paging.pageSize}`

        if (filter) {
            if (filter.pickupDateTime?.[0] != null)
                query += `&pickupDateFrom=${filter.pickupDateTime[0].toDateString()}`
            if (filter.pickupDateTime?.[1] != null)
                query += `&pickupDateTo=${filter.pickupDateTime[1].toDateString()}`
            if (filter.passengerCount)
                query += `&passengerCountFrom=${filter.passengerCount[0]}&passengerCountTo=${filter.passengerCount[1]}`
            if (filter.fareAmount)
                query += `&totalAmountFrom=${filter.fareAmount[0]}&totalAmountTo=${filter.fareAmount[1]}`
            if (filter.tripDistance)
                query += `&tripDistanceFrom=${filter.tripDistance[0]}&tripDistanceTo=${filter.tripDistance[1]}`
            if (filter.paymentType) {
                let typeString = filter.paymentType.join(",")
                query += `&paymentType=${typeString}`
            }
        }

        // return axiosInstance.get<RidesFilterResponseDTO>(
        //     `/Ride/Filter?${query}`
        // );
        return axios.get<RidesFilterResponseDTO>(`http://localhost:3000/api/ride/getRides?${query}`)
    }
    getRidesByQuery(paging: PaginationCriteria, query: string) {
        let apiQuery = "";

        if (paging.page != null && paging.pageSize != null)
            apiQuery += `pageNumber=${paging.page}&pageSize=${paging.pageSize}`

        apiQuery += `&query=${query}`

        // return axiosInstance.get<RidesFilterResponseDTO>(
        //     `/Ride/Filter?${query}`
        // );
        return axios.get<RidesFilterResponseDTO>(`http://localhost:3000/api/ride/getRidesQuery?${apiQuery}`)
    }
    getRide(pickupLat: number, pickupLng: number, pickupDateTime: Dayjs, dropoffDateTime: Dayjs) {
        let query = "";
        query += `pickupDateTime=${pickupDateTime.toLocaleString()}&dropoffDateTime=${dropoffDateTime.toLocaleString()}
        &pickupLat=${pickupLat}&pickupLng=${pickupLng}`

        // return axiosInstance.get<Ride>(
        //     `/Ride/GetRide?${query}`
        // );
        return axios.get<Ride>(`http://localhost:3000/api/ride/getRide?${query}`)
    }
    getRealTimeRides(reqTime: Dayjs) {
        let query = `reqTime=${reqTime.toLocaleString()}`
        return axios.get<RealTimeResponseDTO>(`http://localhost:3000/api/ride/getRealTimeRides?${query}`)
    }
}

export default new TaxiService();
