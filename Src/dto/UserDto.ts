import { ObjectId } from 'mongoose';
import { IRole } from './../interfaces/role.interface';
import { IUser } from './../interfaces/user.interface';
class UserDto {
   

    public mapToUserDto(user: IUser): IUserDto {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            family: user.family,
            mobile: user.mobile,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
            birthday: user.birthday,
            confirmEmail: user.confirmEmail,
            confirmMobile: user.confirmMobile,
            status:user.status,
            roles: user.roles.map((role) => {
                return { id: role.id, name: role.name };
            })
        };
    }

    public userListDto(user: IUser) : IUserListDto {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            family: user.family,
            mobile: user.mobile,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
            confirmEmail: user.confirmEmail,
            confirmMobile: user.confirmMobile,
        };
    }
}

export default UserDto;

export interface IUserDto {
    id: string;
    email: string;
    name: string;
    family: string;
    mobile: string;
    createdAt: Date;
    updatedAt: Date;
    birthday: Date;
    confirmEmail: boolean;
    confirmMobile: boolean;
    status:string,
    roles: { id: ObjectId; name: string }[];
}

export interface IUserListDto{
    id: string;
    email: string;
    name: string;
    family: string;
    mobile: string;
    createdAt: Date;
    updatedAt: Date;
    confirmEmail: boolean;
    confirmMobile: boolean;
}
