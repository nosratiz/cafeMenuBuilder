import { Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    family: string;
    email: string;
    mobile: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    birthday: Date;
    confirmEmail: boolean;
    confirmMobile: boolean;
    confirmCode: string;
    confirmCodeExpire: Date;

    isValidPassword(password: string): Promise<Error | boolean>;
}




