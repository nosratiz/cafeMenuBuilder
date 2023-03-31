import { Router, Request, Response, NextFunction } from 'express';
import Controller from '../utils/interfaces/controller.interface';
import HttpException from '../utils/exception/http.exceptions';
import authenticatedMiddleware from '../middleware/authenticated.middleware';
import RestaurantService from '../services/restaurant.service';
import restaurantValidation from '../validations/restaurant.validation';
import validationMiddleware from '../middleware/validation.middleware';

class RestaurantController implements Controller {
    public path = '/restaurant';
    public router = Router();
    private restaurantService = new RestaurantService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}`,
            authenticatedMiddleware,
            this.restaurantList
        );
        this.router.get(
            `${this.path}/:id`,
            authenticatedMiddleware,
            this.restaurantDetail
        );

        this.router.post(
            `${this.path}`,
            authenticatedMiddleware,
            validationMiddleware(restaurantValidation.createRestaurant),
            this.createRestaurant
        );

        this.router.put(
            `${this.path}/:id`,
            authenticatedMiddleware,
            validationMiddleware(restaurantValidation.updateRestaurant),
            this.updateRestaurant
        );

        this.router.delete(
            `${this.path}/:id`,
            authenticatedMiddleware,
            this.deleteRestaurant
        );
    }

    private restaurantList = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const { page = 1, limit = 10 } = request.query;

            const restaurants = await this.restaurantService.findAll(
                Number(page),
                Number(limit)
            );

            response.status(200).json(restaurants);
        } catch (error) {
            next(new HttpException(500, 'Internal Server Error'));
        }
    };

    private restaurantDetail = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = request.params;

            const restaurant = await this.restaurantService.findOne(id);

            console.log(restaurant);

            if (!restaurant) {
                return next(new HttpException(404, 'Restaurant not found'));
            }

            response.status(200).json(restaurant);
        } catch (error) {
            console.log(error);
        }
    };

    private createRestaurant = async (
        request: Request | any,
        response: Response,
        next: NextFunction
    ) => {
        const { name, logo, description, address, location } = request.body;

        try {
            const restaurant = await this.restaurantService.create(
                name,
                logo,
                description,
                address,
                location,
                request.user.id
            );

            response.status(201).json(restaurant);
        } catch (error) {
            console.log(error);
        }
    };

    private updateRestaurant = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const { id } = request.params;
        const {  name, logo, description, address, location } = request.body;


        console.log(id,name);
        try {
            const restaurant = await this.restaurantService.update(
                id,
                name,
                logo,
                description,
                address,
                location
            );

           

            if (!restaurant) {
                return next(new HttpException(404, 'Restaurant not found'));
            }

            response.status(200).json(restaurant);
        } catch (error) {
            console.log(error);
        }
    };

    private deleteRestaurant = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const { id } = request.params;

        try {
            await this.restaurantService.delete(id);

            response.status(204).json();
        } catch (error) {
            console.log(error);
        }
    };
}

export default RestaurantController;
