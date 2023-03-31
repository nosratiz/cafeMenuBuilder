import * as redis from 'redis';
import { promisify } from 'util';

class RedisExtensions {
    private redisClient: any;
    private getAsync: any;

    constructor() {
        this.redisClient = redis.createClient();
        this.getAsync = promisify(this.redisClient.get).bind(this.redisClient);
    }

    public async get(key: string): Promise<string | null> {
        try {
            const data = await this.getAsync(key);
            return data;
        } catch (err) {
            console.error(err);
            return null;
        } finally {
            this.redisClient.quit();
        }
    }
}

export default RedisExtensions;