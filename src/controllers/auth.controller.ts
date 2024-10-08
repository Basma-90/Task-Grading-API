import { findUserById,findUserByEmail,createUser,updateUser } from "../services/user.services";
import { Request, Response ,NextFunction} from 'express';
import { IUser } from '../models/user.model';
import {userSchema} from'../schemas/user.schema';
import {generateToken ,generateRefreshToken,verifyToken} from '../utils/jwt.utils';
import bcrypt from 'bcrypt';

export const registerUser= async (req: Request, res: Response,next:NextFunction) => {
    try{
        const {name,email,password,role} = userSchema.parse(req.body);
        const userExists = await findUserByEmail(email);
        if(userExists){
            return res.status(400).send({message:'User already exists'});
        }
        console.log(userExists);
        console.log(email);
        const user:IUser = {name,email,password,role} as IUser;
        const newUser = await createUser(user);
        const userId:string = newUser._id as string;
        const refreshToken=newUser.refreshToken as string;
        console.log(refreshToken);
        res.cookie(
            'refreshToken',
            refreshToken,
            {
                httpOnly: true,
                sameSite: 'strict',
                secure: true
            }
        )
        const accessToken = generateToken(userId);
        console.log(accessToken);
        res.status(201).send({accessToken});
    }catch(err:any){
        next(err);
    }
};

export const loginUser = async (req: Request, res: Response,next:NextFunction) => {
    try{
        const {email,password} = userSchema.pick({email: true, password: true}).parse(req.body);
        const user = await findUserByEmail(email);
        if(!user){
            return res.status(400).send({message:'Invalid credentials'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).send({message:'Invalid credentials'});
        }
        const userId :string = user._id as string;
        const refreshToken = generateRefreshToken(userId);
        user.refreshToken = refreshToken;
        await updateUser(userId,user);
        res.cookie(
            'refreshToken',
            refreshToken,
            {
                httpOnly: true,
                sameSite: 'strict',
                secure: true
            }
        )
        const accessToken = generateToken(userId);
        res.status(200).send({accessToken
        });
    }
    catch(err:any){
        next(err);
    }
};

export const logoutUser = async (req: Request, res: Response,next:NextFunction) => {
    try{
        res.clearCookie('refreshToken');
        res.status(200).send({message:'User logged out successfully'});
    }catch(err:any){
        next(err);
    }
};

export const refreshToken = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        console.log(refreshToken);

        if (!refreshToken) {
            return res.status(400).send({ message: 'Refresh token not found' }); 
        }

        const decoded = verifyToken(refreshToken) as {
            [x: string]: any; userId: string 
};
        console.log(decoded);
        const userId:string = decoded.user.id  as string;
        console.log(userId);
        const user = await findUserById(userId);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(400).send({ message: 'Invalid refresh token' }); 
        }

        const accessToken = generateToken(userId);
        return res.status(200).send({ accessToken }); 

    } catch (err: any) {
        console.error('Error refreshing token:', err); 
        if (err.message === 'Refresh token not found' || err.message === 'Invalid refresh token') {
            return res.status(400).send({message: err.message}); 
        }
        next(err);
    }
};
