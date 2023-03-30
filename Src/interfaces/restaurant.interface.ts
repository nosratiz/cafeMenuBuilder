import { Document } from 'mongoose';

export interface IRestaurant extends Document {
    name: string;
    logo: string;
    description: string;
    address: [
        {
            state: string;
            city: string;
            street: string;
            phone: string;
        }
    ];
    location: { lat: number; lng: number };
    userId: { type: string; ref: 'User'};
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    gallery: [{ type: string; }]
}
