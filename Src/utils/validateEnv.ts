import { cleanEnv, str, port,num } from 'envalid';

function validateEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'production'],
        }),
        MONGO_PASSWORD: str(),
        MONGO_PATH: str(),
        MONGO_USER: str(),
        PORT: port({ default: 3000 }),
        File_Size: num(),
        JWT_SECRET: str(),
        


    });
}

export default validateEnv;
