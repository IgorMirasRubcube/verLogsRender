const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?!.*[\[\]\\"'¨()\-+=§´`{ª^~}º/?°;:.,|])(?!.* ).{8,16}$/;

// console.log(passwordRegex.test('IgMira$12]s3'));

const { generate } = require('gerador-validador-cpf')
const { isValid } = require('cpf')

function onlyNumbersCPF(formattedCPF) {
    return formattedCPF.replace(/[.-]/g, '');
}

function isOnlyNumbersCPF(cpf) {
    const regex = /^\d+$/;
    return regex.test(cpf);
}

function getRandom(length){
    return String(Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1)));
}

console.log(getRandom(2))
