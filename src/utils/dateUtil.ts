import dayjs from "dayjs";

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

export const formatDateToBrazilianPortuguese = (date: Date) => {
    return dayjs(date).toDate().toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long'
    });
}