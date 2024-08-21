import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export const multerErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            message: 'Multer error occurred',
            error: err.message,
        });
    }
    if (err.message === 'Only PDFs are allowed') {
        return res.status(400).json({
            message: err.message,
        });
    }
    next(err);
};
