import { MAX_AGE, MAX_TRANSFER_VALUE, MIN_AGE, MIN_TRANSFER_VALUE } from 'constants/index';
import * as cpfUtils from 'cpf';
import fetchCep from 'cep-promise';
import { Prisma } from '@prisma/client';

export function isOnlyNumbers(sentence: string): boolean {
    const regex = /^\d+$/;
    return regex.test(sentence);
}   

export function isSortType(sort: string): boolean {
    if (sort === 'older' || sort === 'newer') {
        return true;
    }
    return false;
}


export function isValidPeriod(period: number): boolean {
    if (period == 15 || period == 30 || period == 60 || period == 90) {
        return true;
    }
    return false;
}

export function isExtractType(type: string): boolean {
    if (type === 'all' || 'entrance' || 'exit' || 'future'){
        return true;
    }
    return false;
}

export function isValidTransferValue(value: Prisma.Decimal): boolean {
    return (Number(value) >= MIN_TRANSFER_VALUE 
    && Number(value) <= MAX_TRANSFER_VALUE);
}

export function isValidTransferStatus(status: string): boolean {
    if (status === 'SCHEDULED' || status === 'COMPLETED' || status === 'CANCELED'){
        return true;
    }
    return false;
}

export function isAfterNow(date: string): boolean {
    const scheduleDate = new Date(date);
    const currentDate = new Date();
    if (scheduleDate <= currentDate) {
        throw new Error('Schedule date must be in the future');
    }
    return true;
};

export function isValidBirthDate(birth_date_string: string): boolean {
    const birth_date = new Date(birth_date_string);
    const diff: number = Date.now() - birth_date.getTime();
    const ageDate = new Date(diff);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return (age >= MIN_AGE && age <= MAX_AGE);
}

export function isValidCPF(cpf: string): boolean  {
    if (!(cpfUtils.isValid(cpf))) {
        throw new Error('Please enter a valid CPF');
    }
    return true;
}

export async function isValidCEP(cep: string): Promise<boolean> {
    try {
        await fetchCep(cep);
        return true;
    } catch (err) {
        throw err;
    }
}

export function hasBirthDate(transfer_password: string, birth_date: Date): boolean {
    const year = String(birth_date.getFullYear());
    let month = String(birth_date.getMonth() + 1);
    let day = String(birth_date.getDate() + 1);

    if (parseInt(day) < 10) {
        day = '0' + day;
    }

    if (parseInt(month) < 10) {
        month = '0' + month;
    }

    if (transfer_password === year ||
        transfer_password === day + month ||
        transfer_password === month + day
    ) {
        return true;
    }

    return false;
}

// passwordRegex verify if has at least 8 characters, among letters, numbers and !@#$%^&* special characters
export const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?!.*[\[\]\\"'¨()\-+=§´`{ª^~}º/?°;:.,|])(?!.* ).{8,16}$/

// noRepeatRegex DONT match if a string has 3 characters OR letters repeated in sequence.
export const noRepeatRegex = /^(?!.*(\w)\1{2,}).+$/

export const noRepeatNumbersRegex = /^(?!.*(\w)\1{2,}).+$/

export function containsSequence(str: string): boolean {
    const sequences: string[] = ["abc", "bcd", "cde", "def", "efg", "fgh", "ghi", "hij", "ijk", "jkl", "klm", "lmn", "mno", "nop", "opq",
        "pqr", "qrs", "rst", "stu", "tuv", "uvw", "vwx", "wxy", "xyz", "ABC", "BCD", "CDE", "DEF", "EFG", "FGH", "GHI", "HIJ", "IJK", "JKL",
        "KLM", "LMN", "MNO", "NOP", "OPQ", "PQR", "QRS", "RST", "STU", "TUV", "UVW", "VWX", "WXY", "XYZ", "012", "123", "234", "345", "456", "567", "678", "789", "890"];

    return sequences.some(sequence => str.includes(sequence));
}

export function containsDigitsSequence(str: string): boolean {
    const sequences: string[] = ["012", "123", "234", "345", "456", "567", "678", "789", "890"];

    return sequences.some(sequence => str.includes(sequence));
}

export function isValidAccountType(account_type: string): boolean {
    return account_type === 'checking' || account_type === 'saving'
}