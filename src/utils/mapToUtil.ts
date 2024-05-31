import { AccountIn } from "dtos/AccountsDTO";
import { AddressIn } from "dtos/AddressesDTO";
import { UserIn } from "dtos/UsersDTO";
import { TransferIn } from "dtos/TransfersDTO";
import { getRandom } from "./numberUtil";
import { ExtractIn } from "dtos/ExtractsDTO";
import { NotificationIn } from "dtos/NotificationsDTO";
import { CalculateDays } from "./dateUtil";

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
            transfer_password,
            account_type
        } = body;

        let account_number = getRandom(8);
        let user_id = '';
        let type = '';
        account_type ? type = account_type : type = 'checking';

        return {
            transfer_password,
            account_number,
            type,
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
        console.log('is_scheduled :', is_scheduled);
        console.log('schedule_date :', schedule_date);
        if (schedule_date) {
            console.log('tem schedule_date')
            schedule_date = new Date(schedule_date);
        }

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
            console.log('periodStartDate string: ', periodStartDate)
            console.log('periodEndDate string: ', periodEndDate)
            // Adjust periodStartDate to start at 00:00:00
            const startOfDay = new Date(periodStartDate);
            startOfDay.setHours(0, 0, 0, 0);
            extractIn.periodStartDate = startOfDay;

            // Adjust periodEndDate to end at 23:59:59
            const endOfDay = new Date(periodEndDate);
            endOfDay.setHours(23, 59, 59, 999);
            extractIn.periodEndDate = endOfDay;
        } else {
            extractIn.periodStartDate = CalculateDays.subtract(new Date(), period);
            extractIn.periodEndDate = new Date();
        }
    
        return extractIn;
    }

    static NotificationIn = (body: any): NotificationIn => {
        const {
            transfer_id,
            account_id,
            text,
        } = body

        return {
            transfer_id,
            account_id,
            text
        }
    }
}