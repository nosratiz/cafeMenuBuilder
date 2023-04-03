import { Request, Response, NextFunction, RequestHandler } from 'express';
import Joi from 'joi';
import { log } from '../utils/log/logger';

function validationMiddleware(schema: Joi.Schema): RequestHandler {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const validationOptions = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        };

        try {
            const value = await schema.validateAsync(
                req.body,
                validationOptions
            );
            req.body = value;
            next();
        } catch (e: any) {
            const errors: string[] = [];
            e.details.forEach((error: Joi.ValidationErrorItem) => {
                console.log(error);
                log.error(error);
                errors.push(error.context?.message ?? error.message);
            });
            res.status(400).send({ message: errors[0] });
        }
    };
}

export default validationMiddleware;
