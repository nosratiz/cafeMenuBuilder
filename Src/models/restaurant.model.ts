import { model, Schema } from 'mongoose';
import { IRestaurant } from '../interfaces/restaurant.interface';

const RestaurantSchema = new Schema({
    name: {
        type: String,
        trim: true,
        index: true,
        required: true,
        unique: true,
    },
    logo: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    address: [
        {
            state: {
                type: String,
                trim: true,
                required: true,
            },
            city: {
                type: String,
                trim: true,
                required: true,
            },
            street: {
                type: String,
                trim: true,
                required: true,
            },
        },
    ],
    location: {
        type: Object,
        lat: {
            type: Number,
            required: true,
        },
        lng: {
            type: Number,
            required: true,
        },
    },
    created_at: {
        type: Date,
        default: Date.now,
        index: true,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    gallery: [{ type: String }],
});

export default model<IRestaurant>('Restaurant', RestaurantSchema);
