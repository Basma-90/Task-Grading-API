import mongoose from 'mongoose';
import { date, string } from 'zod';

export interface ITask extends mongoose.Document {
    title: string;
    description: string;
    deadline: Date;
}

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type:Date, required: true },
},
{ timestamps: true });

export const Task = mongoose.model<ITask>('Task', taskSchema);