import { Request, Response, NextFunction } from 'express';
import token from '../utils/token';
import Token from '../utils/interfaces/token.interface';
import HttpException from '../utils/exception/http.exceptions';
import jwt from 'jsonwebtoken';

async function authenticatedMiddleware(
    req: Request | any,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith('Bearer ')) {
        return next(new HttpException(401, 'unauthorized'));
    }

    const accessToken = bearer.split('Bearer ')[1].trim();
    try {
        const payload: Token | jwt.JsonWebTokenError = await token.verifyToken(
            accessToken
        );

        if (payload instanceof jwt.JsonWebTokenError) {
            return next(new HttpException(401, 'unauthorized'));
        }

        req.user = payload;

        return next();
  
    } catch (error) {
        return next(new HttpException(401, 'unauthorized'));
    }
}

export default authenticatedMiddleware;
