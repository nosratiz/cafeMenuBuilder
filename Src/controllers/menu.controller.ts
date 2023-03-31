import { Router, Request, Response, NextFunction } from 'express';
import Controller from '../utils/interfaces/controller.interface';
import HttpException from '../utils/exception/http.exceptions';
import authenticatedMiddleware from '../middleware/authenticated.middleware';
import MenuService from '../services/menu.service';
import menuValidation from '../validations/menu.validation';
import validationMiddleware from '../middleware/validation.middleware';

class MenuController implements Controller {
    public path = '/menu';
    public router = Router();
    private menuService = new MenuService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, authenticatedMiddleware, this.menuList);
        this.router.get(
            `${this.path}/:id`,
            authenticatedMiddleware,
            this.menuDetail
        );
        this.router.post(
            `${this.path}`,
            authenticatedMiddleware,
            validationMiddleware(menuValidation.menu),
            this.createMenu
        );
        this.router.put(
            `${this.path}/:id`,
            authenticatedMiddleware,
            validationMiddleware(menuValidation.menu),
            this.updateMenu
        );
        this.router.delete(
            `${this.path}/:id`,
            authenticatedMiddleware,
            this.deleteMenu
        );
    }

    private menuList = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const { page = 1, limit = 10 } = request.query;

            const menus = await this.menuService.findAll(
                Number(page),
                Number(limit)
            );

            response.status(200).json(menus);
        } catch (error) {
            next(error);
        }
    };

    private menuDetail = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = request.params;

            const menu = await this.menuService.findOne(id);

            if (!menu) {
                next(new HttpException(404, 'Menu not found'));
            }

            response.status(200).json(menu);
        } catch (error) {
            next(error);
        }
    };

    private createMenu = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const { title, description, image, price, restaurantId } =
                request.body;

            const menu = await this.menuService.create(
                title,
                description,
                image,
                price,
                restaurantId
            );

            response.status(201).json(menu);
        } catch (error) {
            next(error);
        }
    };

    private updateMenu = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = request.params;
            const { title, description, image, price, restaurantId } =
                request.body;

            const menu = await this.menuService.update(
                id,
                title,
                description,
                image,
                price,
                restaurantId
            );

            if (!menu) {
                next(new HttpException(404, 'Menu not found'));
            }

            response.status(200).json(menu);
        } catch (error) {
            next(error);
        }
    };

    private deleteMenu = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const { id } = request.params;

        const menu = await this.menuService.delete(id);

        if (!menu) {
            return next(new HttpException(404, 'Menu not found'));
        }

        response.status(200).json();
    };
}

export default MenuController;
