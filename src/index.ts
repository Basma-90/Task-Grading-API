import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressRateLimit from 'express-rate-limit';
import authRouter from './routes/auth.route';
import { dbConnect,dbDisconnect } from './configDB/db.config';
import taskRouter from './routes/task.route';
import submissionRouter from './routes/submission.route';
import gradeRouter from './routes/grade.route';
import { swaggerUi,swaggerDocs } from './swagger';
import { zodErrorHandler } from './middlewares/zodErrorHandler';
import { ErrorHandler } from './middlewares/errorHandler';
import { multerErrorHandler } from './middlewares/multerErrorHandler';


const app = express();
dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressRateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/users', authRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/submissions', submissionRouter);
app.use('/api/grades', gradeRouter);

app.use(multerErrorHandler);
app.use(zodErrorHandler);
app.use(ErrorHandler);


const server = app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

export default server;
