import Redis from 'ioredis';

class RedisExtensions {
    private redis;

    constructor() {
        const { REDIS_HOST, REDIS_PORT } = process.env;
        
        this.redis = new Redis({
            host: REDIS_HOST,
            port: Number(REDIS_PORT),
        });
    }

    public async get(key: string): Promise<string | null> {
        return await this.redis.get(key);
    }

    public async set(
        key: string,
        value: string,
        expire: number
    ): Promise<void> {
        await this.redis.set(key, value, 'EX', expire);
    }

    public async del(key: string): Promise<void> {
        await this.redis.del(key);
    }
}

export default RedisExtensions;
