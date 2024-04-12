import { AccountIn } from "dtos/AccountsDTO";
import { AddressIn, AddressOut } from "dtos/AddressesDTO";
import { UserIn, UserOut } from "dtos/UsersDTO";
import UserModel from "models/UserModel";
import { genSalt, hash } from 'bcryptjs'
import AddressModel from "models/AddressModel";
import AccountModel from "models/AccountModel";
import { hasBirthDate } from "utils/validationUtil"

export default class CreateUser {
    constructor () {

    }

    async execute(user: UserIn, address: AddressIn, account: AccountIn): Promise<UserOut> {
        const userModel = new UserModel();
        const addressModel = new AddressModel();
        const accountModel = new AccountModel();

        if (hasBirthDate(account.transfer_password, user.birth_date)) {
            throw new Error('Transfer password cannot have birth date infos');
        }

        try {
            const salt = await genSalt(10);
            user.password = await hash(user.password, salt);
            account.transfer_password = await hash(account.transfer_password, salt);
            
            const newAddress: AddressOut | null = await addressModel.create(address) as AddressOut;
            
            user.address_id = newAddress.id;
            const newUser: UserOut = await userModel.create(user) as UserOut;

            if (!newUser?.id) {
                throw new Error('Failed to create user')
            }

            account.user_id = newUser.id;
            await accountModel.create(account);

            return newUser;
        } catch (e) {
            throw e;
        }
    }
}