import { Request, Response ,NextFunction} from 'express';
import { getGrade, gradeSubmission, getGrades } from '../services/grade.services';
import { getStudent } from '../services/submission.services';
import { gradeSchema } from '../schemas/grade.schema';
import { z } from 'zod';

export const gradeSubmissionController = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const validatedData = gradeSchema.omit({gradedAt:true}).parse({
            submission: req.body.submissionId,
            grader: req.body.teacherId,
            grade: req.body.grade,
            feedback: req.body.feedback,
        });
        const teacherId = req.body.teacherId;

        const submission = await gradeSubmission(
            validatedData.submission,
            validatedData.grade,
            validatedData.feedback || '',
            validatedData.grader || ''
        );
        return res.status(201).send(submission);
    } catch (err: any) {
            next(err);
    }
}

export const getGradeController = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const submissionId = req.params.id;
        const studentId = req.body.studentId;
        const student = await getStudent(submissionId);

        if (!student || student !== studentId) {
            return res.status(403).send({ message: "You are not authorized to view this grade" });
        }

        const grade = await getGrade(submissionId);
        return res.status(200).send(grade);
    } catch (err: any) {
        next(err);
    }
}

export const getGradesController = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const teacher = req.params.id;

        if (teacher !== req.body.teacherId) {
            return res.status(403).send('Unauthorized');
        }

        const grades = await getGrades(teacher);
        return res.status(200).send(grades);
    } catch (err: any) {
        next(err);
    }
}
