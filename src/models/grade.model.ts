import mongoose from 'mongoose';

export interface IGrade extends mongoose.Document {
    submission:mongoose.Schema.Types.ObjectId;
    grader:mongoose.Schema.Types.ObjectId;
    grade:number;
    feedback?:string;
    gradedAt:Date;
}

const gradeSchema = new mongoose.Schema({
    submission: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true },
    grader: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    grade: { type: Number, required: true },
    feedback: { type: String },
    gradedAt: { type: Date, required: true },
},
{ timestamps: true });


export const Grade = mongoose.model<IGrade>('Grade', gradeSchema);