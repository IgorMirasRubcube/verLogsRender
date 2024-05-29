export function getRandom(length: number): string {
    return String(Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1)));
}

export const formatNumberToShow = (input: string): string => {
    // Substitui a vírgula decimal por ponto para garantir a conversão correta
    const standardizedInput = input.replace(',', '.');
    // Converte a string para número com 2 casas decimais
    const number = parseFloat(standardizedInput).toFixed(2);

    // Separa a parte inteira da parte decimal
    const [integerPart, decimalPart] = number.split('.');

    // Adiciona ponto como separador de milhar na parte inteira
    const integerPartWithThousands = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Concatena a parte inteira formatada com a parte decimal
    const finalFormattedNumber = `${integerPartWithThousands},${decimalPart}`;

    return finalFormattedNumber;
}