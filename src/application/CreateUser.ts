import { AccountIn } from "dtos/AccountsDTO";
import { AddressIn } from "dtos/AddressesDTO";
import { UserIn, UserOut } from "dtos/UsersDTO";
import UserModel from "models/UserModel";
import { genSalt, hash } from 'bcryptjs'
import AddressModel from "models/AddressModel";
import AccountModel from "models/AccountModel";

export default class CreateUser {
    constructor () {

    }

    async execute(user: UserIn, address: AddressIn, account: AccountIn): Promise<string> {
        const userModel = new UserModel();
        const addressModel = new AddressModel();
        const accountModel = new AccountModel();

        try {
            const salt = await genSalt(10);
            user.password = await hash(user.password, salt);
            const user_id: UserOut = await userModel.create(user);

            await addressModel.create(address);

            account.user_id = user_id.id;
            await accountModel.create(account);

            return user_id.id;
        } catch (e) {
            throw e;
        }
    }
}