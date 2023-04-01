import IPagination from '../utils/interfaces/pagination.interface';
import RestaurantModel from '../models/restaurant.model';
import HttpException from '../utils/exception/http.exceptions';
import RestaurantDto, { IRestaurantDto } from '../dto/RestaurantDto';

class RestaurantService {
    private restaurant = RestaurantModel;

    public async findAll(page: number, limit: number): Promise<IPagination> {
        const [restaurants, count] = await Promise.all([
            this.restaurant
                .find({ isDeleted: false })
                .populate('userId', 'name family')
                .select(
                    '-isDeleted -location -address -gallery -description -updated_at'
                )
                .skip((page - 1) * limit)
                .limit(limit),
            this.restaurant.countDocuments({ isDeleted: false }),
        ]);

        let restaurantsDto = restaurants.map((restaurant) =>
             RestaurantDto.mapToRestaurantListDto(restaurant)
        );

        const restaurantPaginationDto: IPagination = {
            page: page,
            limit: limit,
            total: count,
            totalPages: Math.ceil(count / limit),
            data: restaurantsDto,
        };

        return restaurantPaginationDto;
    }

    public async findOne(
        id: string
    ): Promise<IRestaurantDto | null | HttpException> {
        try {
            const restaurant = await this.restaurant
                .findById(id)
                .populate('userId', 'name family')
                .select('-isDeleted');

            if (!restaurant) {
                return null;
            }

            return RestaurantDto.mapToRestaurantDto(restaurant);
        } catch (error) {
            console.log(error);
            throw new HttpException(404, 'Restaurant not found');
        }
    }

    public async create(
        name: string,
        logo: string,
        description: string,
        address: any,
        location: any,
        userId: string
    ): Promise<IRestaurantDto> {
        const restaurant = await this.restaurant.create({
            name,
            logo,
            description,
            address,
            location,
            userId,
        });

        return  RestaurantDto.mapToRestaurantDto(restaurant);
    }

    public async update(
        id: string,
        name: string,
        logo: string,
        description: string,
        address: any,
        location: any
    ): Promise<IRestaurantDto | null> {
        
        var restaurant = await this.restaurant.findById(id)
        .populate('userId', 'name family');

        if (!restaurant) {
            return null;
        }

        restaurant.name = name;
        restaurant.logo = logo;
        restaurant.description = description;
        restaurant.address = address;
        restaurant.location = location;

        restaurant = await restaurant.save();

        return  RestaurantDto.mapToRestaurantDto(restaurant);
    }

    public async delete(id: string): Promise<void> {
        var restaurant = await this.restaurant.findById(id);

        if (!restaurant) {
            throw new HttpException(404, 'Restaurant not found');
        }

        restaurant.isDeleted = true;

        await restaurant.save();
    }
}

export default RestaurantService;
