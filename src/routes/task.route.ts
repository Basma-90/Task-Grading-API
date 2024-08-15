import express from 'express';
import { addNewTask, getTaskByTitle, getTaskById, updateTaskById, deleteTaskById, getAllTasks } from '../controllers/task.controller';
import { checkAuth, checkRole } from '../middlewares/auth.middleware';

const taskRouter = express.Router();

/**
 * @openapi
 * /task:
 *   post:
 *     summary: Add a new task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - deadline
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Bad request
 */
taskRouter.post('/task', checkAuth, checkRole, addNewTask); // Teachers

/**
 * @openapi
 * /task/{title}:
 *   get:
 *     summary: Get a task by title
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: The title of the task
 *     responses:
 *       200:
 *         description: Task found
 *       400:
 *         description: Bad request
 *       404:
 *         description: Task not found
 */
taskRouter.get('/task/:title', checkAuth, getTaskByTitle);

/**
 * @openapi
 * /task/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Task not found
 */
taskRouter.put('/task/:id', checkAuth, checkRole, updateTaskById); // Teachers

/**
 * @openapi
 * /task/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Task]
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
 *         description: Task deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Task not found
 */
taskRouter.delete('/task/:id', checkAuth, checkRole, deleteTaskById); // Teachers

/**
 * @openapi
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all tasks
 *       400:
 *         description: Bad request
 */
taskRouter.get('/tasks', checkAuth, getAllTasks);

export default taskRouter;
