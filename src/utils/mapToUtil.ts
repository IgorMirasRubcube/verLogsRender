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
        if (period) {
            extractIn.period = period;
        } else {
            extractIn.periodStartDate = new Date(periodStartDate);
            extractIn.periodEndDate = new Date(periodEndDate);
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