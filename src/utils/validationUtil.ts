import { MAX_AGE, MIN_AGE } from 'constants/index';
import * as cpfUtils from 'cpf';

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