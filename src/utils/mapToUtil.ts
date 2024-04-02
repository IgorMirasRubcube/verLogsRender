import { AccountIn } from "dtos/AccountsDTO";
import { AddressIn } from "dtos/AddressesDTO";
import { UserIn } from "dtos/UsersDTO";
import { getRandom } from "./numberUtil";

export abstract class MapTo {
    static UserIn = (body: any): UserIn => {
        let {
            full_name,
            email,
            phone,
            cpf,
            birth_date,
            password
        } = body;

        birth_date = new Date(birth_date);
        email = email.toLowerCase();

        return {
            full_name,
            email,
            phone,
            cpf,
            birth_date,
            password
        };
    }
    
    static AddressIn = (body: any): AddressIn => {
        const {
            cep,
            street,
            number,
            complement,
            neighborhood,
            city,
            state
        } = body;

        return {
            cep,
            street,
            number,
            complement,
            neighborhood,
            city,
            state
        };
    }

    static AccountIn = (body: any): AccountIn => {
        let {
            transfer_password
        } = body;

        let account_number = getRandom(8);
        let user_id = '';

        return {
            transfer_password,
            account_number,
            user_id
        };
    }
}