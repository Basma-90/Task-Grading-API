import { Request, Response, NextFunction } from 'express';
import { findUserById } from '../services/user.services';
import { verifyToken } from '../utils/jwt.utils';

export const checkRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            throw new Error('Access token not found');
        }

        const decoded = verifyToken(accessToken) as {
            [x: string]: any; userId: string
        };
        const userId: string = decoded.user.id as string;
        const user = await findUserById(userId);
        console.log(user);
        if (!user) {
            throw new Error('User not found');
        }
        if (user.role !== 'teacher') {
            throw new Error('Unauthorized');
        }
        next();
    } catch (err: any) {
        res.status(400).send(err.message);
    }
}
export const checkRoleStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            throw new Error('Access token not found');
        }

        const decoded = verifyToken(accessToken) as {
            [x: string]: any; userId: string
        };
        const userId: string = decoded.user.id as string;
        const user = await findUserById(userId);
        console.log(user);
        if (!user) {
            throw new Error('User not found');
        }
        if (user.role !== 'student') {
            throw new Error('Unauthorized');
        }
        next();
    } catch (err: any) {
        res.status(400).send(err.message);
    }
}

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            throw new Error('Access token not found');
        }

        const decoded = verifyToken(accessToken) as {
            [x: string]: any; userId: string
        };
        const userId: string = decoded.user.id as string;
        const user = await findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        next();
    } catch (err: any) {
        res.status(400).send(err.message);
    }
}

export const checkPermission = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            throw new Error('Access token not found');
        }

        const decoded = verifyToken(accessToken) as {
            [x: string]: any; userId: string
        };
        const userId: string = decoded.user.id as string;
        const user = await findUserById(userId);
        console.log(user);
        if (!user) {
            throw new Error('User not found');
        }
        if (req.params.id !== userId) {
            throw new Error('Unauthorized');
        }
        next();
    }
    catch (err: any) {
        res.status(400).send(err.message);
    }
}

export const getTeacherId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            throw new Error('Access token not found');
        }

        const decoded = verifyToken(accessToken) as {
            [x: string]: any; userId: string
        };
        const userId: string = decoded.user.id as string;
        console.log("c,",userId);
        const user = await findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if(user.role !== 'teacher'){
            throw new Error('Unauthorized');
        }
        req.body.teacherId = userId;
        next();
    } catch (err: any) {
        res.status(400).send(err.message);
    }
}

export const getStudentId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            throw new Error('Access token not found');
        }

        const decoded = verifyToken(accessToken) as {
            [x: string]: any; userId: string
        };
        const userId: string = decoded.user.id as string;
        const user = await findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if(user.role !== 'student'){
            throw new Error('Unauthorized');
        }
        req.body.studentId = userId;
        next();
    } catch (err: any) {
        res.status(400).send(err.message);  
    }
}