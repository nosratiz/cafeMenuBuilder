import {Router, Request, Response, NextFunction, request} from 'express';
import Controller from '../utils/interfaces/controller.interface';
import HttpException from '../utils/exception/http.exceptions';
import UserService from '../services/user.service';
import accountValidation from '../validations/account.validation';
import validationMiddleware from '../middleware/validation.middleware';
import {log} from '../utils/log/logger';

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
    }

    private adminLogin = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const {email, password} = request.body;

        try {
            const result = await this.userService.adminLogin(email, password);
            console.log(result);

            if (!result.data) {
                return next(new HttpException(result.status, result.message));
            }

            response.status(200).json({token: result.data});
        } catch (error) {
            next(new HttpException(500, 'Internal Server Error'));
        }
    };
   
}

export default AccountController;
