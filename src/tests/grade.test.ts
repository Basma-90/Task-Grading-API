import supertest from "supertest";
import express from "express";
import submissionRouter from "../routes/submission.route";
import { checkAuth, checkPermission, checkRole, checkRoleStudent, getStudentId, getTeacherId } from "../middlewares/auth.middleware";
import { gradeSchema } from "../schemas/grade.schema";
import { gradeSubmission, getGrade, getGrades, } from "../services/grade.services";
import e from "express";
import { getStudent } from "../services/submission.services";
import gradeRouter from "../routes/grade.route";
import { get } from "config";

const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', gradeRouter);

jest.mock('../services/grade.services', () => ({
    gradeSubmission: jest.fn(),
    getGrade: jest.fn(),
    getGrades: jest.fn(),
}));
jest.mock('../services/submission.services', () => ({
    getStudent: jest.fn(),
}));
jest.mock('../middlewares/auth.middleware', () => ({
    checkAuth: jest.fn((req, res, next) => next()),
    checkRoleStudent: jest.fn((req, res, next) => next()),
    getStudentId: jest.fn((req, res, next) => {
        req.body.studentId = '123';
        next();
    }),
    getTeacherId: jest.fn((req, res, next) => {
        req.body.teacherId = '123';
        next();
    }),
    checkRole: jest.fn((req, res, next) => next()),
    checkPermission: jest.fn((req, res, next) => next()),
}));
jest.mock('../schemas/grade.schema', () => ({
    gradeSchema: {
        omit: jest.fn(),
        parse: jest.fn(),
    },
}));

describe('Grade Routes', () => {
    it.concurrent('should grade a submission', async () => {
        const mockGradedSubmission = {
            submission: '123',
            grade: 90,
            feedback: 'Good job',
            grader: '123',
        };

        (gradeSchema.parse as jest.Mock).mockReturnValue(mockGradedSubmission);
        (gradeSchema.omit as jest.Mock).mockReturnValue(gradeSchema);
        (checkAuth as jest.Mock).mockImplementation((req, res, next) => next());
        (checkRole as jest.Mock).mockImplementation((req, res, next) => next());
        (getTeacherId as jest.Mock).mockImplementation((req, res, next) => {
            req.body.teacherId = '123';
            next();
        });
        (gradeSubmission as jest.Mock).mockResolvedValue({
            submission: '123',
            grade: 90,
            feedback: 'Good job',
            grader: '123',
            graded: true,
        });
        const req = supertest(app).post('/api/grade');
        const res = await req.send({
            submission: '123',
            grade: 90,
            feedback: 'Good job',
        });
        console.log(res.body);
        expect(res.status).toBe(201);  
        expect(res.body).toEqual({
            submission: '123',
            grade: 90,
            feedback: 'Good job',
            grader: '123',
            graded: true,
        });
    });

    it.concurrent('should get a grade', async () => {
        const mockGrade = {
            submission: '123',
            grade: 90,
            feedback: 'Good job',
            grader: '123',
            graded: true,
        };
        (checkAuth as jest.Mock).mockImplementation((req, res, next) => next());
        (checkRoleStudent as jest.Mock).mockImplementation((req, res, next) => next());
        (getStudentId as jest.Mock).mockImplementation((req, res, next) => {
            req.body.studentId = '123';
            next();
        });
        (getStudent as jest.Mock).mockResolvedValue('123');
        (getGrade as jest.Mock).mockResolvedValue(mockGrade);

        const req = supertest(app).get('/api/grade/123');
        const res = await req.send();
        console.log(res.body);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockGrade);
    });

    it.concurrent('should get all grades', async () => {
        const mockGrades = [
            {
                submission: '123',
                grade: 90,
                feedback: 'Good job',
                grader: '123',
                graded: true,
            },
            {
                submission: '456',
                grade: 80,
                feedback: 'Great job',
                grader: '123',
                graded: true,
            },
        ];
        (checkAuth as jest.Mock).mockImplementation((req, res, next) => next());
        (checkRole as jest.Mock).mockImplementation((req, res, next) => next());
        (getTeacherId as jest.Mock).mockImplementation((req, res, next) => {
            req.body.teacherId = '123';
            next();
        });
        (getGrades as jest.Mock).mockResolvedValue(mockGrades);

        const req = supertest(app).get('/api/grades/123');
        const res = await req.send();
        console.log(res.body);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockGrades);
    });

    it('should return 403 if student is not authorized to view grade', async () => {
        (checkAuth as jest.Mock).mockImplementation((req, res, next) => next());
        (checkRoleStudent as jest.Mock).mockImplementation((req, res, next) => next());
        (getStudentId as jest.Mock).mockImplementation((req, res, next) => {
            req.body.studentId = '123';
            next();
        });
        (getStudent as jest.Mock).mockResolvedValue('456');

        const req = supertest(app).get('/api/grade/123');
        const res = await req.send();
        console.log(res.body);
        expect(res.status).toBe(403);
        expect(res.body).toEqual({ message: 'You are not authorized to view this grade' });
    });
});
