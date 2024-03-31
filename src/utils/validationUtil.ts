import { MAX_AGE, MIN_AGE } from 'constants/index';
import * as cpfUtils from 'cpf';
import cep from 'cep-promise';
import e from 'express';

export function isOnlyNumbers(sentence: string): boolean {
    const regex = /^\d+$/;
    return regex.test(sentence);
}

export function isValidBirthDate(birth_date_string: string): boolean {
    const birth_date = new Date(birth_date_string);
    const diff: number = Date.now() - birth_date.getTime();
    const ageDate = new Date(diff);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return (age >= MIN_AGE && age <= MAX_AGE);
}

export function isValidCPF(cpf: string): Error | boolean  {
    if (!(cpfUtils.isValid(cpf))) {
        throw new Error('Please enter a valid CPF');
    }
    return true;
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

// export function isValidCEP(cep: string): Promise