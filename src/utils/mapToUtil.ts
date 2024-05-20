import { AccountIn } from "dtos/AccountsDTO";
import { AddressIn } from "dtos/AddressesDTO";
import { UserIn } from "dtos/UsersDTO";
import { TransferIn } from "dtos/TransfersDTO";
import { getRandom } from "./numberUtil";
import { ExtractIn } from "dtos/ExtractsDTO";
import { NotificationIn } from "dtos/NotificationsDTO";

export abstract class MapTo {
    static UserIn = (body: any): UserIn => {
        let {
            full_name,
            email,
            phone,
            cpf,
            birth_date,
            password,
            role
        } = body;

        birth_date = new Date(birth_date);
        email = email.toLowerCase();
        
        let userIn: UserIn = {
            full_name,
            email,
            phone,
            cpf,
            birth_date,
            password,
        }

        if (role) userIn.role = role;

        return userIn;
    }
    
    static AddressIn = (body: any): AddressIn => {
        let {
            cep,
            street,
            number,
            complement,
            neighborhood,
            city,
            state
        } = body;

        state = state.toUpperCase();

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

    static TransferIn = (body: any): TransferIn => {
        let {
            from_account_id,
            to_account_id,
            value,
            description,
            type,
            is_scheduled,
            schedule_date,
            status,
        } = body

        schedule_date = new Date(schedule_date);

        return {
            from_account_id,
            to_account_id,
            value,
            description,
            type,
            is_scheduled,
            schedule_date,
            status,
        }
    }

    static ExtractIn = (query: any): ExtractIn => {
        const {
            type,
            period,
            sort,
            periodStartDate,
            periodEndDate
        } = query;

        let extractIn: ExtractIn = {
            type: type,
            sort: sort
        };
        if (type) extractIn.type = type;
        if (sort) extractIn.sort = sort;
        if (periodStartDate && periodEndDate) {
            extractIn.periodStartDate = periodStartDate;
            extractIn.periodEndDate = periodEndDate;
        } else {
            extractIn.period = period;
        }
    
        return extractIn;
    }

    static NotificationIn = (body: any): NotificationIn => {
        const {
            transfer_id,
            user_id,
            text,
        } = body

        return {
            transfer_id,
            user_id,
            text
        }
    }
}