import { Submission } from "../models/submission.model";
import { ISubmission } from "../models/submission.model";
import { findUserById } from "./user.services";
import { findTaskById } from "./task.services";

export const submitTask = async (studentId: string, taskId: string, fileUrl: string): Promise<ISubmission> => {
    try {
        const student = await findUserById(studentId);
        if (!student) {
            throw new Error('Student not found');
        }
        const task = await findTaskById(taskId);
        if (!task) {
            throw new Error('Task not found');
        }
        const now = new Date();
        if (now > task.deadline) {
            throw new Error('Deadline has passed');
        }
        const submission = new Submission({
            student: studentId,
            task: taskId,
            fileUrl: fileUrl,
            submittedAt: now
        });
        await submission.save();
        return submission;
    }
    catch (err: any) {
        throw new Error(err.message);
    }
}

export const getSubmission = async (submissionId: string): Promise<ISubmission> => {
    try {
        const submission = await Submission.findById(submissionId);
        if (!submission) {
            throw new Error('Submission not found');
        }
        return submission;
    }
    catch (err: any) {
        throw new Error(err.message);
    }
}

export const getSubmissionForTeacher = async (submissionId: string): Promise<ISubmission> => {
    try {
        const submission = await Submission.findById(submissionId)
            .populate('student', 'name -_id');
        if (!submission) {
            throw new Error('Submission not found');
        }
        return submission;
    }
    catch (err: any) {
        throw new Error(err.message);
    }
}

export const viewSubmissions = async (taskId: string): Promise<ISubmission[]> => {
    try {
        const submissions = await Submission.find({ task: taskId })
            .populate('student', 'name -_id'); 
        return submissions;

    }
    catch (err: any) {
        throw new Error(err.message);
    }
}

export const getStudent = async (submissionId: string): Promise<string> => {
    try {
        const submission = await Submission.findById(submissionId);
        if (!submission) {
            throw new Error('Submission not found');
        }
        const studentId = submission.student.toString();
        return studentId;
    }
    catch (err: any) {
        throw new Error(err.message);
    }
}