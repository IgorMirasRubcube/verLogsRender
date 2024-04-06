export class CalculateDays {
    static subtract = (date: Date, days: number): Date => {
        date.setDate(date.getDate() - days);
        return date;
    }

    static add = (date: Date, days: number): Date => {
        date.setDate(date.getDate() + days);
        return date;
    }
}