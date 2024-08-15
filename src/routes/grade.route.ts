import express from 'express';
import { gradeSubmissionController, getGradeController, getGradesController } from '../controllers/grade.controller';
import { checkAuth, checkRole, getStudentId, getTeacherId, checkPermission, checkRoleStudent } from '../middlewares/auth.middleware';

const gradeRouter = express.Router();

/**
 * @openapi
 * /grade:
 *   post:
 *     summary: Grade a submission
 *     tags: [Grade]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               submissionId:
 *                 type: string
 *               teacherId:
 *                 type: string
 *               grade:
 *                 type: number
 *               feedback:
 *                 type: string
 *     responses:
 *       201:
 *         description: Submission graded successfully
 *       400:
 *         description: Bad request
 */
gradeRouter.post('/grade', checkAuth, checkRole, getTeacherId, gradeSubmissionController);

/**
 * @openapi
 * /grade/{id}:
 *   get:
 *     summary: Get a specific grade by submission ID
 *     tags: [Grade]
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
 *         description: Grade found
 *       400:
 *         description: Bad request
 *       403:
 *         description: You are not authorized to view this grade
 */
gradeRouter.get('/grade/:id', checkAuth, checkRoleStudent, getStudentId, getGradeController);

/**
 * @openapi
 * /grades/{id}:
 *   get:
 *     summary: Get all grades given by a specific teacher by teacher ID
 *     tags: [Grade]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the teacher
 *     responses:
 *       200:
 *         description: Successfully retrieved all grades
 *       400:
 *         description: Bad request
 *       403:
 *         description: Unauthorized
 */
gradeRouter.get('/grades/:id', checkAuth, checkRole, getTeacherId, getGradesController);

export default gradeRouter;
