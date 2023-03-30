import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { randomUUID } from 'crypto';

class fileUpload {
    public mimeTypes: String[] = process.env.File_Mime_Extension
        ? process.env.File_Mime_Extension.split(',')
        : [];

    constructor() {
        this.createFileFolder();
    }

    private createFileFolder(): void {
        if (!fs.existsSync(path.resolve(__dirname, '..', 'uploads'))) {
            fs.mkdirSync(path.resolve(__dirname, '..', 'uploads'));
        }
    }

    public storage(): multer.StorageEngine {
        return multer.diskStorage({
            destination: path.resolve(__dirname, '..', 'uploads'),
            filename: (req, file, cb) => {
                const fileName = `${randomUUID}.${
                    file.originalname.split('.')[1]
                }`;

                cb(null, fileName);
            },
        });
    }

    public fileFilter(req: any, file: any, cb: Function): void {
        if (!this.mimeTypes.includes(file.mimetype)) {
            cb(new Error('Invalid file type'));
        }

        if (file.size > Number(process.env.File_Size)) {
            cb(new Error('File size is too large'));
        }

        cb(null, true);
    }

    public multerConfig(): multer.Multer | any {
        return multer({
            storage: this.storage(),
            fileFilter: this.fileFilter,
            limits: { fileSize: Number(process.env.File_Size) },
        }).single('file');
    }
}

export default fileUpload;
