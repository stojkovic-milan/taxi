interface RidesFilterResponseDTO {
    rides: Ride[];
    totalCount: number;
}
interface StatisticsData {
    [key: string]: number;
}
interface TimeSeriesAnalysisDTO {
    monthlyAnalysis: [[number, number]];
    dayOfWeekAnalysis: [[number, number]];
    hourOfDayAnalysis: [[number, number]];
}
interface RealTimeResponseDTO {
    rides: Ride[];
    reqTime: Date;
}