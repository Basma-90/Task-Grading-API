import {User, IUser} from '../models/user.model';
import { generateToken, generateRefreshToken, verifyToken } from '../utils/jwt.utils';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

export const findUserByEmail = async (email: string) => {
    try {
            return await User.findOne({ email: email });
    } catch (e:any) {
        throw new Error(e.message);
    }
}

export const findUserById = async (id: string) => {
    try {
        return await User.findById(id);
    }
    catch (e:any) {
        throw new Error(e.message);
    }
}

export const createUser = async (user: IUser) => {
    try {
        let{name,email,password,role} = user;
        let newUser = new User({name,email,password,role});

        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        const userId :string = newUser._id as string;
        const refreshToken = generateRefreshToken(userId);
        newUser.refreshToken = refreshToken;
        await newUser.save();
        return newUser;
    } catch (e:any) {
        throw new Error(e.message);
    }
}

export const updateUser = async (id: string, user: IUser) => {
    try {
        return await User.findByIdAndUpdate(id, user, { new: true });
    }
    catch (e:any) {
        throw new Error(e.message);
    }
}

