import { IMenu } from '../interfaces/menu.interface';

class MenuDto {
    public mapToMenuDto(menu: IMenu): IMenuDto {
        return {
            id: menu.id,
            title: menu.title,
            description: menu.description,
            image: menu.image,
            price: menu.price,
            restaurant: {
                id: menu.restaurantId.id,
                name: menu.restaurantId.name,
                logo: menu.restaurantId.logo,
            },
            createdAt: menu.createdAt,
            updatedAt: menu.updatedAt,
        };
    }

    public mapToMenuListDto(menu: IMenu): IMenuListDto {
        return {
            id: menu.id,
            title: menu.title,
            image: menu.image,
            price: menu.price,
            createAt: menu.createdAt,
        };
    }
}

export default MenuDto;

export interface IMenuDto {
    id: string;
    title: string;
    description: string;
    image: string;
    price: number;
    restaurant: { id: string; name: string; logo: string };
    createdAt: Date;
    updatedAt: Date;
}

export interface IMenuListDto {
    id: string;
    title: string;
    image: string;
    price: number;
    createAt: Date;
}
