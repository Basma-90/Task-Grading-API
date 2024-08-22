import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Submission } from './models/submission.model';
import { Grade } from './models/grade.model';

const swaggerOptions: swaggerJsDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'TASK GRADING API',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Name of the user',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email of the user',
                        },
                        password: {
                            type: 'string',
                            description: 'Password of the user',
                        },
                        role: {
                            type: 'string',
                            description: 'Role of the user',
                            enum: ['student', 'teacher'],
                        },
                        refreshToken: {
                            type: 'string',
                            description: 'JWT Refresh Token',
                        },
                    },
                    required: ['name', 'email', 'password', 'role'],
                },
                Task: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                            description: 'Title of the task',
                        },
                        description: {
                            type: 'string',
                            description: 'Description of the task',
                        },
                        deadline: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Deadline of the task',
                        },
                    },
                    required: ['title', 'description', 'deadline'],
                },
                Submission: {
                    type: 'object',
                    properties: {
                        student: {
                            type: 'string',
                            description: 'Student who submitted the task',
                        },
                        task: {
                            type: 'string',
                            description: 'Task submitted by the student',
                        },
                        fileUrl: {
                            type: 'string',
                            description: 'URL of the submitted file',
                        },
                        submittedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Time of submission',
                        },
                        graded: {
                            type: 'boolean',
                            description: 'Whether the submission is graded or not',
                        },
                    },
                    required: ['student', 'task', 'fileUrl'],
                },
                Grade: {
                    type: 'object',
                    properties: {
                        submission: {
                            type: 'string',
                            description: 'Submission graded',
                        },
                        grader: {
                            type: 'string',
                            description: 'Teacher who graded the submission',
                        },
                        grade: {
                            type: 'number',
                            description: 'Grade given to the submission',
                        },
                        feedback: {
                            type: 'string',
                            description: 'Feedback given to the student',
                        },
                        gradedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Time of grading',
                        },
                    },
                    required: ['submission', 'grade', 'feedback'],
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'], 
};


const swaggerDocs = swaggerJsDoc(swaggerOptions);

export {
    swaggerUi,
    swaggerDocs,
};