import { Request, Response, NextFunction } from 'express';
import RedisExtensions from '../utils/redis';

export default async function menuCache(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    
    const redis = new RedisExtensions();
    
    const { restaurantId } = req.params;

    const data = await redis.get(restaurantId);
    
    if (data) {
        return res.status(200).json(JSON.parse(data));
    }
    return next();
}
