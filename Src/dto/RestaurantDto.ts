import { IRestaurant } from '../interfaces/restaurant.interface';
import { ObjectId } from 'mongoose';

class RestaurantDto {
    public mapToRestaurantDto(restaurant: IRestaurant): IRestaurantDto {
        return {
            id: restaurant.id,
            name: restaurant.name,
            logo: restaurant.logo,
            description: restaurant.description,
            address: restaurant.address,
            location: restaurant.location,
            user: {
                id: restaurant.userId.id,
                name: restaurant.userId.name,
                family: restaurant.userId.family,
            },
            createdAt: restaurant.createdAt,
            updatedAt: restaurant.updatedAt,
        };
    }

    public mapToRestaurantListDto(restaurant: IRestaurant): IRestaurantListDto {
        return {
            id: restaurant.id,
            name: restaurant.name,
            logo: restaurant.logo,
            createdAt: restaurant.createdAt,
            user: {
                id: restaurant.userId.id,
                name: restaurant.userId.name,
                family: restaurant.userId.family,
            },
        };
    }
}

export default RestaurantDto;

export interface IRestaurantDto {
    id: string;
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
    user: { id: string; name: string; family: string };
    createdAt: Date;
    updatedAt: Date;
}

export interface IRestaurantListDto {
    id: string;
    name: string;
    logo: string;
    createdAt: Date;
    user: { id: string; name: string; family: string };
}
