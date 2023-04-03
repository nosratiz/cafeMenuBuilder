import { Request, Response, NextFunction } from 'express';
import HttpException from '../utils/exception/http.exceptions';
import { log } from '../utils/log/logger';

function errorMiddleware(
    error: HttpException,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    console.log(error);
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    log.error(error);
    res.status(status).send({
        status,
        message,
    });
}

export default errorMiddleware;
