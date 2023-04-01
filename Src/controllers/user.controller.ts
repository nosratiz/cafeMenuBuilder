import { Router, Request, Response, NextFunction } from 'express';
import Controller from '../utils/interfaces/controller.interface';
import HttpException from '../utils/exception/http.exceptions';
import UserService from '../services/user.service';
import authenticatedMiddleware from '../middleware/authenticated.middleware';

class UserController implements Controller {
    public path = '/user';
    public router = Router();
    private userService = new UserService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, authenticatedMiddleware, this.UserList);
        this.router.get(
            `${this.path}/:id`,
            authenticatedMiddleware,
            this.UserDetail
        );
    }

    private UserList = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const { page = 1, limit = 10 } = request.query;

            const users = await this.userService.findAll(
                Number(page),
                Number(limit)
            );

            response.status(200).json(users);
        } catch (error) {
            next(new HttpException(500, 'Internal Server Error'));
        }
    };

    private UserDetail = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = request.params;

            const result = await this.userService.findOne(id);

            console.log(result);

            if (!result.data) {
               return next(new HttpException(result.status, result.message));
            }

            response.status(200).json(result.data);
        } catch (error) {
            console.log(error);
        }
    };
}

export default UserController;
