import { Router, Request, Response, NextFunction } from 'express';
import Controller from '../utils/interfaces/controller.interface';
import HttpException from '../utils/exception/http.exceptions';
import path from 'path';

class FileController implements Controller {
    public path = '/file';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/upload`, this.upload);
        this.router.get(`${this.path}/uploads/:fileName`, this.download);
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

            const relativePath = file?.path.split('/dist')[1];

            console.log();

            response.status(200).json({ path: relativePath });
        } catch (error) {
            next(new HttpException(500, 'Internal Server Error'));
        }
    };

    private download = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            console.log(request.params);
            const{fileName}=request.params;
            const directoryPath = path.join(__dirname,'../uploads/');
            

            response.sendFile(directoryPath + fileName);
        } catch (error) {
            next(new HttpException(500, 'Internal Server Error'));
        }
    }
}

export default FileController;
