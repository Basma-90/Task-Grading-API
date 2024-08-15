import multer from 'multer';
import path from 'path';
import express from 'express';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const filename = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
        const filePath = filename.replace(/\\/g, '/');
        cb(null, filePath);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.pdf') {
            return cb(new Error('Only PDFs are allowed'));
        }
        cb(null, true);
    },
});

export default upload;
