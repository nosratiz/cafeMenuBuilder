import IPagination from '../utils/interfaces/pagination.interface';
import HttpException from '../utils/exception/http.exceptions';
import MenuDto, { IMenuDto } from '../dto/MenuDto';
import MenuModel from '../models/menu.model';

class MenuService {
    private menu = MenuModel;

    public async findAll(page: number, limit: number): Promise<IPagination> {
        var [menus, count] = await Promise.all([
            this.menu
                .find({ isDeleted: false })
                .populate('restaurantId', 'name logo')
                .select('-isDeleted')
                .skip((page - 1) * limit)
                .limit(limit),
            this.menu.countDocuments({ isDeleted: false }),
        ]);

        let menusDto = menus.map((menu) =>
            new MenuDto().mapToMenuListDto(menu)
        );

        const menuPaginationDto: IPagination = {
            page: page,
            limit: limit,
            total: count,
            totalPages: Math.ceil(count / limit),
            data: menusDto,
        };

        return menuPaginationDto;
    }

    public async findOne(id: string): Promise<IMenuDto | null | HttpException> {
        var menu = await this.menu
            .findOne({ id, isDeleted: false })
            .populate('restaurantId', 'name logo')
            .select('-isDeleted');

        if (!menu) {
            return null;
        }

        return new MenuDto().mapToMenuDto(menu);
    }

    public async create(
        title: string,
        description: string,
        image: string,
        price: number,
        restaurantId: string
    ): Promise<IMenuDto | HttpException> {
        const menu = await this.menu.create({
            title,
            description,
            image,
            price,
            restaurantId,
        });

        return new MenuDto().mapToMenuDto(menu);
    }

    public async update(
        id: string,
        title: string,
        description: string,
        image: string,
        price: number,
        restaurantId: string
    ): Promise<IMenuDto | null> {
        const menu = await this.menu.findOneAndUpdate(
            { id, isDeleted: false },
            { title, description, image, price, restaurantId },
            { new: true }
        );

        if (!menu) {
            return null;
        }

        return new MenuDto().mapToMenuDto(menu);
    }

    public async delete(id: string): Promise<boolean> {
        const menu = await this.menu.findOneAndUpdate(
            { id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (!menu) {
            return false;
        }

        return true;
    }

}

export default MenuService;
