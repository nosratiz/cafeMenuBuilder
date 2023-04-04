import { Router, Request, Response, NextFunction } from 'express';
import Controller from '../utils/interfaces/controller.interface';
import HttpException from '../utils/exception/http.exceptions';
import UserService from '../services/user.service';
import accountValidation from '../validations/account.validation';
import validationMiddleware from '../middleware/validation.middleware';
import authenticatedMiddleware from '../middleware/authenticated.middleware';

class AccountController implements Controller {
    public path = '/account';
    public router = Router();
    private userService = new UserService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            `${this.path}/login`,
            validationMiddleware(accountValidation.adminLogin),
            this.adminLogin
        );

        this.router.post(
            `${this.path}/change-password`,
            authenticatedMiddleware,
            validationMiddleware(accountValidation.changePassword),
            this.changePassword
        );
    }

    private adminLogin = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const { email, password } = request.body;

        try {
            const result = await this.userService.adminLogin(email, password);
            console.log(result);

            if (!result.data) {
                return next(new HttpException(result.status, result.message));
            }

            response.status(200).json({ token: result.data });
        } catch (error) {
            next(new HttpException(500, 'Internal Server Error'));
        }
    };

    private changePassword = async (
        request: Request | any,
        response: Response,
        next: NextFunction
    ) => {
        const { oldPassword, newPassword } = request.body;
        const { id } = request.user;
        try {
            const result = await this.userService.changePassword(
                id,
                oldPassword,
                newPassword
            );

            if (!result.data) {
                return next(new HttpException(result.status, result.message));
            }

            response.status(200).json(result.data);
        } catch (error) {
            next(new HttpException(500, 'Internal Server Error'));
        }
    };

    private registerUser = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const { email, password, name, family, mobile } = request.body;

            const result = await this.userService.registerUser(
                email,
                password,
                name,
                family,
                mobile
            );

            if (!result.data) {
                return next(new HttpException(result.status, result.message));
            }

            response.status(200).json(result.data);
        } catch (error) {}
    };
}

export default AccountController;
