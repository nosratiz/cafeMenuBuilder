import IPagination from '../utils/interfaces/pagination.interface';
import RestaurantModel from '../models/restaurant.model';
import HttpException from '../utils/exception/http.exceptions';
import RestaurantDto, {
    IRestaurantDto,
} from '../dto/RestaurantDto';
import { ILocation } from "../interfaces/ILocation.interface";
import { IAddress } from "../interfaces/IAddress.interface";
import Result from '../dto/ResultDto';
import IResult from '../utils/interfaces/result.interface';

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

    public async findOne(id: string): Promise<IResult> {
        try {
            const result = new Result();
            const restaurant = await this.restaurant
                .findById(id)
                .populate('userId', 'name family')
                .select('-isDeleted');

            if (!restaurant) {
                result.status = 404;
                result.message = 'Restaurant not found';
                return result;
            }

            result.data = RestaurantDto.mapToRestaurantDto(restaurant);

            return result;
        } catch (error) {
            console.log(error);
            throw new HttpException(404, 'Restaurant not found');
        }
    }

    public async create(
        name: string,
        logo: string,
        description: string,
        address: IAddress,
        location: ILocation,
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

        return RestaurantDto.mapToRestaurantDto(restaurant);
    }

    public async update(
        id: string,
        name: string,
        logo: string,
        description: string,
        address: IAddress,
        location: ILocation
    ): Promise<IResult> {
        const result = new Result();

        var restaurant = await this.restaurant
            .findById(id)
            .populate('userId', 'name family');

        if (!restaurant) {
            result.status = 404;
            result.message = 'Restaurant not found';
            return result;
        }

        restaurant.name = name;
        restaurant.logo = logo;
        restaurant.description = description;
        restaurant.address = address;
        restaurant.location = location;

        restaurant = await restaurant.save();

        result.data = RestaurantDto.mapToRestaurantDto(restaurant);

        return result;
    }

    public async delete(id: string): Promise<IResult> {
        const result = new Result();

        var restaurant = await this.restaurant.findById(id);

        if (!restaurant) {
            result.status = 404;
            result.message = 'Restaurant not found';
            return result;
        }

        restaurant.isDeleted = true;

        await restaurant.save();

        return result;
    }
}

export default RestaurantService;
