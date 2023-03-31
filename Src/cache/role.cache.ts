import { Request, Response, NextFunction } from 'express';
import RedisExtensions from '../utils/redis';

export default async function roleCache(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
   
    const redis = new RedisExtensions();
   
    const data = await redis.get('roles');
    if (data) {
        return res.status(200).json(JSON.parse(data));
    }
    return next();
}
