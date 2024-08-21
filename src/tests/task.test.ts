import request from "supertest";
import express from "express";
import taskRouter from "../routes/task.route";
import {
    createTask,
    findTaskById,
    findTaskByTitle,
    updateTask,
    deleteTask,
    getTasks,
} from "../services/task.services";
import { checkAuth, checkRole } from "../middlewares/auth.middleware";
import { taskSchema } from "../schemas/task.schema";

jest.mock("../services/task.services", () => ({
    createTask: jest.fn(),
    findTaskById: jest.fn(),
    findTaskByTitle: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    getTasks: jest.fn(),
    getTaskByTitle: jest.fn(),
}));

jest.mock("../middlewares/auth.middleware", () => ({
    checkAuth: jest.fn((req, res, next) => next()),
    checkRoleStudent: jest.fn((req, res, next) => next()),
    getStudentId: jest.fn((req, res, next) => {
        req.body.studentId = "123";
        next();
    }),
    getTeacherId: jest.fn((req, res, next) => {
        req.body.teacherId = "123";
        next();
    }),
    checkRole: jest.fn((req, res, next) => next()),
    checkPermission: jest.fn((req, res, next) => next()),
}));

jest.mock("../schemas/task.schema", () => ({
    taskSchema: {
        omit: jest.fn(),
        parse: jest.fn(),
    },
}));

const app = express();
app.use(express.json());
app.use("/api", taskRouter);

describe("Task Routes", () => {
    describe("POST /task", () => {
        it("should create a new task and return 201 status", async () => {
            (taskSchema.parse as jest.Mock).mockReturnValue({
                title: "Task",
                description: "Task description",
                deadline: "2023-12-31T23:59:59Z",
            });
            (taskSchema.omit as jest.Mock).mockReturnValue(taskSchema);
            (checkAuth as jest.Mock).mockImplementation((req, res, next) => next());
            (checkRole as jest.Mock).mockImplementation((req, res, next) => next());
            (createTask as jest.Mock).mockResolvedValue({
                title: "Task",
                description: "Task description",
                deadline: "2023-12-31T23:59:59Z",
            });
            const response = await request(app).post("/api/task").send({
                title: "Task",
                description: "Task description",
                deadline: "2023-12-31T23:59:59Z",
            });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("title", "Task");
            expect(createTask).toHaveBeenCalled();
        });
    });
    describe("GET /task/:title", () => {
        it("should return a task by title", async () => {
            (checkAuth as jest.Mock).mockImplementation((req, res, next) => next());
            (findTaskByTitle as jest.Mock).mockResolvedValue({
                title: "Task",
                description: "Task description",
                deadline: "2023-12-31T23:59:59Z",
            });
            const response = await request(app).get("/api/task/Task").send();
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("title", "Task");
            expect(findTaskByTitle).toHaveBeenCalled();
        });
        it("should return 404 if task not found", async () => {
            (checkAuth as jest.Mock).mockImplementation((req, res, next) => next());
            (findTaskByTitle as jest.Mock).mockResolvedValue(null);
            const response = await request(app)
                .get("/api/task/Nonexistent Task")
                .send();
            console.log(response.body);
            expect(response.status).toBe(404);
        });
    });
    describe("PUT /task/:id", () => {
        it("should update a task by ID and return 200 status", async () => {
            (checkAuth as jest.Mock).mockImplementation((req, res, next) =>
                next()
            );
            (checkRole as jest.Mock).mockImplementation((req, res, next) =>
                next()
            );
            (taskSchema.parse as jest.Mock).mockReturnValue({
                title: "Updated Task",
                description: "Updated description",
                deadline: "2023-12-31T23:59:59Z",
            });
            (taskSchema.omit as jest.Mock).mockReturnValue(taskSchema);
            (updateTask as jest.Mock).mockResolvedValue({
                title: "Updated Task",
                description: "Updated description",
                deadline: "2023-12-31T23:59:59Z",
            });
            const response = await request(app).put("/api/task/1").send({
                title: "Updated Task",
                description: "Updated description",
                deadline: "2023-12-31T23:59:59Z",
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("title", "Updated Task");
            expect(updateTask).toHaveBeenCalled();
        });
        it("should return 404 if task to update is not found", async () => {
            (checkAuth as jest.Mock).mockImplementation((req, res, next) =>
                next()
            );
            (checkRole as jest.Mock).mockImplementation((req, res, next) =>
                next()
            );
            (taskSchema.parse as jest.Mock).mockReturnValue({
                title: "Updated Task",
                description: "Updated description",
                deadline: "2023-12-31T23:59:59Z",
            });
            (taskSchema.omit as jest.Mock).mockReturnValue(taskSchema);
            (updateTask as jest.Mock).mockImplementation(() => {
                throw new Error("Task not found");
            });
            const response = await request(app)
                .put("/api/task/3")
                .send({
                    title: "Updated Task",
                    description: "Updated description",
                    deadline: "2023-12-31T23:59:59Z",
                });
            expect(response.status).toBe(404);
        });
    });

    describe("DELETE /task/:id", () => {
        it.concurrent("should delete a task by ID and return 200 status", async () => {
            (checkAuth as jest.Mock).mockImplementation((req, res, next) =>
                next()
            );
            (checkRole as jest.Mock).mockImplementation((req, res, next) =>
                next()
            );
            (deleteTask as jest.Mock).mockResolvedValue(true);

            const response = await request(app).delete("/api/task/1").send();
            expect(response.status).toBe(200);
            expect(deleteTask).toHaveBeenCalled();
        }
        );

        it("should return 404 if task to delete is not found", async () => {
            (checkAuth as jest.Mock).mockImplementation((req, res, next) =>
                next()
            );
            (checkRole as jest.Mock).mockImplementation((req, res, next) =>
                next()
            );
            (deleteTask as jest.Mock).mockImplementation(() => {
                throw new Error("Task not found");
            });
            const response = await request(app)
                .delete("/api/task/Nonexistent ID")
                .send();
            expect(response.status).toBe(404);
        });
    });

    describe("GET /tasks", () => {
        it("should return all tasks and 200 status", async () => {
            (checkAuth as jest.Mock).mockImplementation((req, res, next) =>
                next()
            );
            (checkRole as jest.Mock).mockImplementation((req, res, next) =>
                next()
            );
            (getTasks as jest.Mock).mockResolvedValue([
                {
                    title: "Task 1",
                    description: "Description 1",
                    deadline: "2023-12-31T23:59:59Z",
                },
                {
                    title: "Task 2",
                    description: "Description 2",
                    deadline: "2023-12-31T23:59:59Z",
                },
            ]);
            const response = await request(app).get("/api/tasks").send();
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(getTasks).toHaveBeenCalled();
        });
    });
});
