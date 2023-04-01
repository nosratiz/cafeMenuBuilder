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
import BackgroundJob from './Jobs/BackgroundJob';
import schedule from 'node-schedule';

class app {
    public express: Application;
    public port: number;

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;

        this.initializeDatabaseConnection();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.InitializeBackgroundJobs();
        this.initializeErrorHandling();
     
    }

    private initializeMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(fileUpload.multerConfig().single('file'));
        this.express.use(compression());
        this.express.use(
            '/uploads',
            express.static(path.join(__dirname, '../uploads'))
        );
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

        SeedData.seed();
    }

    private InitializeBackgroundJobs(): void {
        schedule.scheduleJob("*/2 * * * * *", BackgroundJob.SendEmail);
    }

    public listen(): void {
        const server = this.express.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });

        const io = require('./utils/socket').init(server);
        io.on('connect', (socket: any) => {
            console.log('Client connected', socket.handshake.auth);
            console.log(io.engine.clientsCount);
        });
    }
}

export default app;
