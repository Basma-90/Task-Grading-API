import request from 'supertest';
import express from 'express';
import taskRouter from '../routes/task.route';
import { createTask, findTaskById, findTaskByTitle, updateTask, deleteTask, getTasks } from '../services/task.services';
import { checkAuth, checkRole } from '../middlewares/auth.middleware';
import { create } from 'domain';

jest.mock('../controllers/task.controller', () => ({
    addNewTask: jest.fn(),
    getTaskByTitle: jest.fn(),
    getTaskById: jest.fn(),
    updateTaskById: jest.fn(),
    deleteTaskById: jest.fn(),
    getAllTasks: jest.fn(),
}));
jest.mock('../services/task.services', () => ({
    createTask: jest.fn(),
    findTaskById: jest.fn(),
    findTaskByTitle: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    getTasks: jest.fn(),
}));

jest.mock('../middlewares/auth.middleware', () => ({
    checkAuth: jest.fn((req, res, next) => next()),  
    checkRole: jest.fn((req, res, next) => next()), 
}));

const app = express();
app.use(express.json());
app.use('/api', taskRouter);

describe('Task Routes', () => {
    describe('POST /task', () => {
        it('should create a new task and return 201 status', async () => {
            (createTask as jest.Mock).mockResolvedValue({
                title: 'New Task',
                description: 'Task description',
                deadline: '2023-12-31T23:59:59Z'
            });

            const response = await request(app)
                .post('/api/task')
                .send({
                    title: 'New Task',
                    description: 'Task description',
                    deadline: '2023-12-31T23:59:59Z'
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('title', 'New Task');
            expect(createTask).toHaveBeenCalled();
        });

        it('should return 400 if task data is invalid', async () => {
            (createTask as jest.Mock).mockImplementation(() => {
                throw new Error('Invalid task data');
            });

            const response = await request(app)
                .post('/api/task')
                .send({
                    description: 'Task description'
                });
            expect(response.status).toBe(400);
        });
    });
    describe('GET /task/:title', () => {
        it('should return a task by title', async () => {
            (findTaskByTitle as jest.Mock).mockResolvedValue({
                title: 'Existing Task',
                description: 'Task description',
                deadline: '2023-12-31T23:59:59Z'
            });

            const response = await request(app)
                .get('/api/task/Existing Task')
                .send();

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('title', 'Existing Task');
            expect(findTaskByTitle).toHaveBeenCalled();
        });

        it('should return 404 if task not found', async () => {
            (findTaskByTitle as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .get('/api/task/Nonexistent Task')
                .send();

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /task/:id', () => {
        it('should update a task by ID and return 200 status', async () => {
            (updateTask as jest.Mock).mockResolvedValue({
                title: 'Updated Task',
                description: 'Updated description',
                deadline: '2023-12-31T23:59:59Z'
            });

            const response = await request(app)
                .put('/api/task/1')
                .send({
                    title: 'Updated Task',
                    description: 'Updated description',
                    deadline: '2023-12-31T23:59:59Z'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('title', 'Updated Task');
            expect(updateTask).toHaveBeenCalled();
        });

        it('should return 404 if task to update is not found', async () => {
            (updateTask as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .put('/api/task/Nonexistent ID')
                .send({
                    title: 'Updated Task',
                    description: 'Updated description'
                });

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /task/:id', () => {
        it('should delete a task by ID and return 200 status', async () => {
            (deleteTask as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .delete('/api/task/1')
                .send();

            expect(response.status).toBe(200);
            expect(deleteTask).toHaveBeenCalled();
        });

        it('should return 404 if task to delete is not found', async () => {
            (deleteTask as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .delete('/api/task/Nonexistent ID')
                .send();

            expect(response.status).toBe(404);
        });
    });

    describe('GET /tasks', () => {
        it('should return all tasks and 200 status', async () => {
            (getTasks as jest.Mock).mockResolvedValue([
                { title: 'Task 1', description: 'Description 1', deadline: '2023-12-31T23:59:59Z' },
                { title: 'Task 2', description: 'Description 2', deadline: '2023-12-31T23:59:59Z' }
            ]);

            const response = await request(app)
                .get('/api/tasks')
                .send();

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(getTasks).toHaveBeenCalled();
        });

        it('should return 400 if there is an error retrieving tasks', async () => {
            (getTasks as jest.Mock).mockImplementation(() => {
                throw new Error('Failed to retrieve tasks');
            });

            const response = await request(app)
                .get('/api/tasks')
                .send();

            expect(response.status).toBe(400);
        });
    });
});

