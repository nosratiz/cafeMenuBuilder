import IPagination from '../utils/interfaces/pagination.interface';
import HttpException from '../utils/exception/http.exceptions';
import MenuDto, { IMenuDto, IMenuListDto } from '../dto/MenuDto';
import MenuModel from '../models/menu.model';
import RedisExtensions from '../utils/redis';

class MenuService {
    private menu = MenuModel;
    private redis : RedisExtensions;

    constructor() {
        this.redis = new RedisExtensions();
    }

    public async findAll(page: number, limit: number): Promise<IPagination> {
        const [menus, count] = await Promise.all([
            this.menu
                .find({ isDeleted: false })
                .populate('restaurantId', 'name logo')
                .select('-isDeleted')
                .skip((page - 1) * limit)
                .limit(limit),
            this.menu.countDocuments({ isDeleted: false }),
        ]);

        let menusDto = menus.map((menu) =>
            MenuDto.mapToMenuListDto(menu)
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
        
        console.log(id);
        
        const menu = await this.menu
            .findOne({ _id: id, isDeleted: false })
            .populate('restaurantId', 'name logo');

        console.log(menu);

        if (!menu) {
            return null;
        }

        return MenuDto.mapToMenuDto(menu);
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

        this.redis.del(`${menu.restaurantId}`);

        return  MenuDto.mapToMenuDto(menu);
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

        this.redis.del(`${menu.restaurantId}`);

        return  MenuDto.mapToMenuDto(menu);
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

        this.redis.del(`${menu.restaurantId}`);

        return true;
    }

    public async findByRestaurantId(
        restaurantId: string
    ): Promise<IMenuListDto[]> {

       const menus= await this.menu.find({ restaurantId, isDeleted: false })
            .populate('restaurantId', 'name logo')
            .select('-isDeleted');

        let menusListDto = menus.map((menu) =>
             MenuDto.mapToMenuListDto(menu)
        );

        await this.redis.set(restaurantId, JSON.stringify(menusListDto), 60 * 60 * 24);

        return menusListDto;
    }
}

export default MenuService;
