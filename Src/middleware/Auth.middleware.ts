import { Request, Response, NextFunction, RequestHandler } from 'express';
import _ from 'lodash';

function authMiddleware(roleName: string[]): RequestHandler {
    return async (
        req: Request | any,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const { roles } = req.user;

        var result = _.intersection(roleName, roles);

        if (result.length === 0) {
            return res.status(403).json({
                message: 'You are not authorized to access this resource',
            });
        }

        next();
    };
}

export default authMiddleware;
