import { Prisma } from "@prisma/client";
import UserModel from "models/UserModel";
import { MapTo } from "utils/mapToUtil";

export default class ResetUserAttempt {
    constructor () {

    }

    async execute(): Promise<void> {
        const userModel = new UserModel();
        
        try {
            await userModel.resetAttemptMany();
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}