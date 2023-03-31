import { Router, Request, Response, NextFunction } from 'express';
import Controller from '../utils/interfaces/controller.interface';
import authenticatedMiddleware from '../middleware/authenticated.middleware';
import RoleService from '../services/role.service';
import roleCache from '../cache/role.cache';

class RoleController implements Controller {
    public path = '/role';
    public router = Router();
    private roleService = new RoleService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}`,
            authenticatedMiddleware,
            roleCache,
            this.roleList
        );
    }

    private roleList = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const roles = await this.roleService.getRole();

            response.status(200).json(roles);
        } catch (error) {
            next(error);
        }
    };
}

export default RoleController;
