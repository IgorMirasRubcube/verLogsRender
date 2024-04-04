export interface ExtractIn {
    type: string;   // all, entrance, exit and future
    period?: number; // 15, 30, 60, 90
    sort: string;   // older, newer
    periodStartDate?: Date;
    periodEndDate?: Date;
}