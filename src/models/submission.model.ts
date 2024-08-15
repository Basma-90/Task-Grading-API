import mongoose from 'mongoose';

export interface ISubmission extends mongoose.Document {
    student:mongoose.Schema.Types.ObjectId;
    task:mongoose.Schema.Types.ObjectId;
    fileUrl: string;
    submittedAt: Date;  
    graded:boolean;
}

const submissionSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    fileUrl: { type: String, required: true },
    submittedAt: { type: Date},
    graded: { type: Boolean, default: false }
},
{ timestamps: true });


export const Submission = mongoose.model<ISubmission>('Submission', submissionSchema);
