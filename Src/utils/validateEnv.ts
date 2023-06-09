import { cleanEnv, str, port,num } from 'envalid';

function validateEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'production'],
        }),
        MONGO_PATH: str(),
        PORT: port({ default: 3000 }),
        File_Size: num(),
        JWT_SECRET: str(),
        REDIS_HOST: str(),
        


    });
}

export default validateEnv;
