import { Router, Request, Response, NextFunction } from 'express';
import Controller from '../utils/interfaces/controller.interface';
import HttpException from '../utils/exception/http.exceptions';

class FileController implements Controller {
    public path = '/file';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/upload`, this.upload);
    }

    private upload = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const file = request.file;
        console.log(file);

            if (!file) {
                next(new HttpException(400, 'Invalid file'));
            }

            console.log(file?.path);

            response.status(200).json({ path: file?.path });
        } catch (error) {
            next(new HttpException(500, 'Internal Server Error'));
        }
    };
}


export default FileController;
