import { Request, Response, NextFunction } from 'express';
import { findUserById } from '../services/user.services';
import { verifyToken } from '../utils/jwt.utils';

export const checkRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            return res.status(401).send({ message: 'Access token not found' });
        }
        const decoded = verifyToken(accessToken) as {
            [x: string]: any; userId: string
        };
        const userId: string = decoded.user.id as string;
        const user = await findUserById(userId);
        console.log(user);
        if (!user) {
            return res.status(401).send({ message: 'User not found' });
        }
        if (user.role !== 'teacher') {
            return res.status(403).send({ message: 'Unauthorized' });
        }
        next();
    } catch (err: any) {
        next(err);
    }
}
export const checkRoleStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            return res.status(401).send({ message: 'Access token not found' });
        }

        const decoded = verifyToken(accessToken) as {
            [x: string]: any; userId: string
        };
        const userId: string = decoded.user.id as string;
        const user = await findUserById(userId);
        console.log(user);
        if (!user) {
            return res.status(401).send({ message: 'User not found' });
        }
        if (user.role !== 'student') {
            return res.status(403).send({ message: 'Unauthorized' });
        }
        next();
    } catch (err: any) {
        next(err);
    }
}

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            return res.status(401).send({ message: 'Access token not found' }); 
        }

        const decoded = verifyToken(accessToken) as {
            [x: string]: any; userId: string
        };
        const userId: string = decoded.user.id as string;
        const user = await findUserById(userId);
        if (!user) {
            return res.status(401).send({ message: 'User not found' });
        }
        next();
    } catch (err: any) {
        next(err);
    }
}

export const checkPermission = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            return res.status(401).send({ message: 'Access token not found' });
        }

        const decoded = verifyToken(accessToken) as {
            [x: string]: any; userId: string
        };
        const userId: string = decoded.user.id as string;
        const user = await findUserById(userId);
        console.log(user);
        if (!user) {
            return res.status(401).send({ message: 'User not found' });
        }
        if (req.params.id !== userId) {
            return res.status(403).send({ message: 'Unauthorized' });
        }
        next();
    }
    catch (err: any) {
        next(err);
    }
}

export const getTeacherId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            return res.status(401).send({ message: 'Access token not found' });
        }

        const decoded = verifyToken(accessToken) as {
            [x: string]: any; userId: string
        };
        const userId: string = decoded.user.id as string;
        console.log("c,",userId);
        const user = await findUserById(userId);
        if (!user) {
            return res.status(401).send({ message: 'User not found' });
        }
        if(user.role !== 'teacher'){
            return res.status(403).send({ message: 'Unauthorized' });
        }
        req.body.teacherId = userId;
        next();
    } catch (err: any) {
        next(err);
    }
}

export const getStudentId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            return res.status(401).send({ message: 'Access token not found' });
        }

        const decoded = verifyToken(accessToken) as {
            [x: string]: any; userId: string
        };
        const userId: string = decoded.user.id as string;
        const user = await findUserById(userId);
        if (!user) {
            return res.status(401).send({ message: 'User not found' });
        }
        if(user.role !== 'student'){
            return res.status(403).send({ message: 'Unauthorized' });
        }
        req.body.studentId = userId;
        next();
    } catch (err: any) {
        next(err);
    }
}