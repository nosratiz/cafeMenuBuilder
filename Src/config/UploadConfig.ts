import { NextFunction, Request, RequestHandler } from 'express';
import path from 'path';
import fs from 'fs';
import multer, { FileFilterCallback } from 'multer';
import { randomUUID } from 'crypto';
import HttpException from '../utils/exception/http.exceptions';

class fileUpload {
    public mimeTypes: String[];

    constructor() {
        this.createFileFolder();
        this.mimeTypes =  process.env.File_Mime_Extension
        ? process.env.File_Mime_Extension.split(',')
        : [];
    }

    private createFileFolder(): void {
        if (!fs.existsSync(path.join(__dirname, "../uploads"))) {
            fs.mkdirSync(path.join(__dirname, "../uploads"));
        }
    }

    public storage(): multer.StorageEngine {
        return multer.diskStorage({
            destination: (req, file, cb) => { 
                cb(null, path.join(__dirname, "../uploads"));
            },
            filename: (req, file, cb) => {
                const fileName = `${randomUUID()}.${
                    file.originalname.split('.')[1]
                }`;
                cb(null, fileName);
            },
        });
    }

    public fileFilter(
        req: Request ,
        file: Express.Multer.File,
        cb: FileFilterCallback,
    ): void {
    
        if (!this.mimeTypes.includes(file.mimetype)) {
            
            cb(new HttpException(400,'Invalid file type'));
        }

        if (file.size > Number(process.env.File_Size)) {
            cb(new HttpException(400, 'File size is too large'));
        }

        cb(null, true);
    } 

    public multerConfig(): multer.Multer  {
        return multer({
            storage: this.storage(),
            fileFilter: this.fileFilter.bind(this),
            limits: { fileSize: Number(process.env.File_Size) },
        });
    }
}

export default new fileUpload();
