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


const date = new Date('2022-09-12');
const day = String(date.getDate());
console.log(day)

function hasBirthDate(birth_date) {
    const year = String(birth_date.getFullYear());
    let month = String(birth_date.getMonth() + 1);
    const day = String(birth_date.getDate() + 1);
    console.log(year)

    if (parseInt(day) < 10){
        day = '0' + day;
        console.log(day);
    }

    if (parseInt(month) < 10){
        month = '0' + month;
        console.log(month);
    }
    console.log(day+month);
}

hasBirthDate(date)
