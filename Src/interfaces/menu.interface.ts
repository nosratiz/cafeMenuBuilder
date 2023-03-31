import { Document, ObjectId } from 'mongoose';

export interface IMenu extends Document {
    title: string;
    description: string;
    image: string;
    price: number;
    restaurantId: {
        logo: string;
        name: string;
        id: string;
        type: ObjectId;
        ref: 'Restaurant';
    };
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}
