import express from 'express';
import { submitTaskController, getSubmissionController, getSubmissionsController, getSubmissionForTeacherController } from '../controllers/submission.controller';
import upload from '../utils/upload.utils';
import { checkAuth, checkRole, checkPermission, checkRoleStudent, getStudentId } from '../middlewares/auth.middleware';

const submissionRouter = express.Router();

/**
 * @openapi
 * /api/submissions/submit:
 *   post:
 *     summary: Submit a task
 *     tags: [Submission]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               taskId:
 *                 type: string
 *               studentId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task submitted successfully
 *       400:
 *         description: Bad request
 */
submissionRouter.post('/submit', checkAuth, checkRoleStudent, upload.single('file'), submitTaskController);

/**
 * @openapi
 * /api/submissions/submission/{id}:
 *   get:
 *     summary: Get a specific submission by ID
 *     tags: [Submission]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the submission
 *     responses:
 *       200:
 *         description: Submission found
 *       400:
 *         description: Bad request
 *       403:
 *         description: You are not authorized to view this submission
 */
submissionRouter.get('/submission/:id', checkAuth, checkRoleStudent, getStudentId, getSubmissionController);

/**
 * @openapi
 * /api/submissions/submissions/{id}:
 *   get:
 *     summary: Get all submissions for a specific task by task ID
 *     tags: [Submission]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task
 *     responses:
 *       200:
 *         description: Successfully retrieved all submissions
 *       400:
 *         description: Bad request
 */
submissionRouter.get('/submissions/:id', checkAuth, checkRole, getSubmissionsController);

/**
 * @openapi
 * /api/submissions/submission/teacher/{id}:
 *   get:
 *     summary: Get a specific submission for teachers by submission ID
 *     tags: [Submission]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the submission
 *     responses:
 *       200:
 *         description: Submission found
 *       400:
 *         description: Bad request
 */
submissionRouter.get('/submission/teacher/:id', checkAuth, checkRole, getSubmissionForTeacherController);

export default submissionRouter;
