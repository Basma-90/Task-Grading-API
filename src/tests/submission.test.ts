import supertest from "supertest";
import express from "express";
import submissionRouter from "../routes/submission.route";
import { checkAuth, checkPermission, checkRole, checkRoleStudent, getStudentId, getTeacherId } from "../middlewares/auth.middleware";
import { submissionSchema } from "../schemas/submission.schema";
import { submitTask, getSubmission, getSubmissionForTeacher, viewSubmissions ,getStudent} from "../services/submission.services";
const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', submissionRouter);

jest.mock('../schemas/submission.schema', () => ({
    submissionSchema: {
        omit: jest.fn(),
        parse: jest.fn(),
    },
}));

jest.mock('../services/submission.services', () => ({
    submitTask: jest.fn(),
    getSubmission: jest.fn(),
    getSubmissionForTeacher: jest.fn(),
    viewSubmissions: jest.fn(),
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

describe('Submission Routes', () => {
    it.concurrent('should submit a task', async () => {
        (submissionSchema.omit as jest.Mock).mockReturnValue(submissionSchema);
        (checkAuth as jest.Mock).mockImplementation((req, res, next) => next());
        (checkRoleStudent as jest.Mock).mockImplementation((req, res, next) => next());
        (submissionSchema.parse as jest.Mock).mockReturnValue({
            student: '123',
            task: '456',
            fileUrl: 'file',
            graded: false,
            submittedAt: new Date(),
        });
        (getStudentId as jest.Mock).mockImplementation((req, res, next) => {
            req.body.studentId = '123';
            next();
        });

        const req = supertest(app).post('/api/submit');
        const res = await req.send({
            studentId: '123',
            taskId: '456',
            fileUrl: 'file',
        });
        console.log('Response Status:', res.body);
        expect(res.status).toBe(201);
    });

    it.concurrent('should get all submissions', async () => {
        (checkAuth as jest.Mock).mockImplementation((req, res, next) => next());
        (checkRole as jest.Mock).mockImplementation((req, res, next) => next());
        (getTeacherId as jest.Mock).mockImplementation((req, res, next) => {
            req.body.teacherId = '123';
            next();
        });
        const req = supertest(app).get('/api/submissions/123');
        const res = await req.send();
        expect(res.status).toBe(200);
    });
    it.concurrent('should get a specific submission', async () => {
        (checkAuth as jest.Mock).mockImplementation((req, res, next) => next());
        (checkRoleStudent as jest.Mock).mockImplementation((req, res, next) => next());
        (checkPermission as jest.Mock).mockImplementation((req, res, next) => next());
        (getStudent as jest.Mock).mockReturnValue('123');
        (getStudentId as jest.Mock).mockImplementation((req, res, next) => {
            req.body.studentId = '123';
            next();
        });
        (getSubmission as jest.Mock).mockReturnValue({
            student: '123',
            task: '456',
            fileUrl: 'file',
            graded: false,
            submittedAt: new Date(),
        });
        const token = 'valid-token';
        const req = supertest(app)
            .get('/api/submission/123')
            .set('Authorization', `Bearer ${token}`);
    
        const res = await req.send();
        console.log('Response Status:', res.status);
        console.log('Response Body:', res.body);
        expect(res.status).toBe(200);
    });
    it.concurrent('should get a specific submission for teacher', async () => {
        (checkAuth as jest.Mock).mockImplementation((req, res, next) => next());
        (checkRole as jest.Mock).mockImplementation((req, res, next) => next());
        (getTeacherId as jest.Mock).mockImplementation((req, res, next) => {
            req.body.teacherId = '123';
            next();
        });
        (getSubmissionForTeacher as jest.Mock).mockReturnValue({
            student: '123',
            task: '456',
            fileUrl: 'file',
            graded: false,
            submittedAt: new Date(),
        });
        const req = supertest(app).get('/api/submission/123');
        const res = await req.send();
        expect(res.status).toBe(200);
    });

    it('should return 403 if student is not authorized to view submission', async () => {
        (checkAuth as jest.Mock).mockImplementation((req, res, next) => next());
        (checkRoleStudent as jest.Mock).mockImplementation((req, res, next) => next());
        (getStudentId as jest.Mock).mockImplementation((req, res, next) => {
            req.body.studentId = '123';
            next();
        });
        (getStudent as jest.Mock).mockReturnValue({
            student: '456',
        });
        const req = supertest(app).get('/api/submission/123');
        const res = await req.send();
        expect(res.status).toBe(403);
    });

});