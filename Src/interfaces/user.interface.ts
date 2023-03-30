import { Document, ObjectId } from 'mongoose';

export interface IUser extends Document {
    name: string;
    family: string;
    email: string;
    mobile: string;
    password: string;
    created_at: Date;
    updated_at: Date;
    isDeleted: boolean;
    birthday: Date;
    confirmEmail: boolean;
    confirmMobile: boolean;
    confirmCode: string;
    confirmCodeExpire: Date;
    status: string;
    roles: {
        name: string;
        id: ObjectId; ref: 'Role',  
}[];

    isValidPassword(password: string): Promise<Error | boolean>;
}
