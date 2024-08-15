import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    role: string;
    refreshToken?: string;
}

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    refreshToken: { type: String },
});

export const User = mongoose.model<IUser>('User', userSchema);