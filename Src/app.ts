import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import Controller from './utils/interfaces/controller.interface';
import ErrorMiddleware from './middleware/error.middleware';
import mongoose from 'mongoose';
import SeedData from './config/SeedData';
import fileUpload from './config/UploadConfig';
import path from 'path';
import * as redis from 'redis';
import { str } from 'envalid';

class app {
    public express: Application;
    public port: number;
    public seedData = new SeedData();
    public fileUpload = new fileUpload();

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;

        this.initializeDatabaseConnection();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    
    }

    private initializeMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(this.fileUpload.multerConfig().single('file'));
        this.express.use(compression());
        this.express.use('/uploads',express.static(path.join(__dirname, '../uploads')));
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller) => {
            this.express.use('/', controller.router);
        });
    }

    private initializeErrorHandling(): void {
        this.express.use(ErrorMiddleware);
    }

    private initializeDatabaseConnection(): void {
        const { MONGO_PATH } = process.env;

        mongoose.connect(`mongodb://${MONGO_PATH}`);

        this.seedData.seed();
    }

  

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

export default app;
