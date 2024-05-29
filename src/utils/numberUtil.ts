export function getRandom(length: number): string {
    return String(Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1)));
}

export const formatNumberToSend = (input: string): string => {
    // Remover separador de milhar '.'
    const withoutThousandSeparator = input.replace(/\./g, '');

    // Trocar separador decimal ',' por '.'
    const withDotDecimalSeparator = withoutThousandSeparator.replace(/,/, '.');

    return withDotDecimalSeparator;
}