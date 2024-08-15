import { ISubmission } from '../models/submission.model';
import { Submission } from '../models/submission.model';
import { Grade } from '../models/grade.model';
import { IGrade } from '../models/grade.model';
import { Request, Response } from 'express';

export const gradeSubmission = async(submissionId: string, grade: number ,feedback :string ,grader:string): Promise<ISubmission> => {
    try {
        const submission = await Submission.findById(submissionId);
        if (!submission) {
            throw new Error('Submission not found');
        }
        if (submission.graded) {
            throw new Error('Submission already graded');
        }
        const gradeObj = new Grade({
            submission: submissionId,
            grader: grader,
            grade: grade,
            feedback: feedback,
            gradedAt: new Date()
        });
        await gradeObj.save();
        submission.graded = true;
        await submission.populate('student', 'name -_id');
        await submission.save();
        return submission;
    }
    catch (err: any) {
        throw new Error(err.message);
    }
}

export const getGrade = async(submissionId: string): Promise<IGrade> => { //for students
    try {
        const grade = await Grade.findOne({ submission: submissionId });
        await grade?.populate('grader', 'name -_id');
        if (!grade) {
            throw new Error('Grade not found');
        }
        return grade;
    }
    catch (err: any) {
        throw new Error(err.message);
    }
}
export const getGrades = async(graderId: string): Promise<IGrade[]> => {
    try {
        const grades = await Grade.find({ grader: graderId });
        return grades;
    }
    catch (err: any) {
        throw new Error(err.message);
    }
}


