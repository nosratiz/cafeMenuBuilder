import { ILocation } from "../interfaces/ILocation.interface";
import { IAddress } from "./IAddress.interface";
import { Document, ObjectId } from 'mongoose';

export interface IRestaurant extends Document {
    name: string;
    logo: string;
    description: string;
    address: IAddress
    location: ILocation;
    userId: {
        family: string;
        name: string;
        id: string;
        type: ObjectId ; ref: 'User'
};
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    gallery: [{ type: string; }]
}
