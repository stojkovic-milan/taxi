interface Ride {
    cabType: string;
    vendorId: string;
    pickupDatetime: Date;
    dropoffDatetime: Date;
    rateCodeId: string;
    pickupLatitude: number;
    pickupLongitude: number;
    dropoffLatitude: number;
    dropoffLongitude: number;
    passengerCount: number;
    tripDistance: number;
    fareAmount: number;
    // extra: number;
    // mtaTax: number;
    tipAmount: number;
    // tollsAmount: number;
    // ehailFee: number;
    improvementSurcharge: number;
    // congestionSurcharge: number;
    totalAmount: number;
    paymentType: string;
    tripType: string;
    pickupGeohash: string;
    // pickupLocationId: number;
    // dropoffLocationId: number;
}
