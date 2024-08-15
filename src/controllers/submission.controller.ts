import upload from "../utils/upload.utils";
import { Request, Response } from "express";
import { submitTask, getSubmission, getStudent, viewSubmissions ,getSubmissionForTeacher } from "../services/submission.services";
import { submissionSchema } from "../schemas/submission.schema";
import { z } from 'zod';

export const submitTaskController = async (req: Request, res: Response) => {
    try {
        const validatedData = submissionSchema.omit({submittedAt:true}).parse({
            student: req.body.studentId,
            task: req.body.taskId,
            fileUrl: req.file?.path, 
            graded: false
        });

        const submission = await submitTask(validatedData.student, validatedData.task, validatedData.fileUrl);
        return res.status(201).send(submission);
    } catch (err: any) {
            return res.status(400).send({ errors: err.errors });
    }
};

export const getSubmissionController = async (req: Request, res: Response) => {
    try {
        const submissionId = req.params.id;
        const studentId = req.body.studentId;
        const student = await getStudent(submissionId);

        if (!student || student !== studentId) {
            return res.status(403).send({ message: "You are not authorized to view this submission" });
        }
        const submission = await getSubmission(submissionId);
        return res.status(200).send(submission);
    } catch (err: any) {
        return res.status(400).send({ message: err.message });
    }
};

export const getSubmissionForTeacherController = async (req: Request, res: Response) => {
    try {
        const submissionId = req.params.id;
        const submission = await getSubmissionForTeacher(submissionId);
        return res.status(200).send(submission);
    } catch (err: any) {
        return res.status(400).send({ message: err.message });
    }
};

export const getSubmissionsController = async (req: Request, res: Response) => {
    try {
        const taskId = req.params.id;
        const submissions = await viewSubmissions(taskId);
        return res.status(200).send(submissions);
    } catch (err: any) {
        return res.status(400).send({ message: err.message });
    }
};
