import {Request ,Response} from 'express';
import { findTaskByTitle,findTaskById,updateTask ,deleteTask,createTask,getTasks } from '../services/task.services';
import { ITask } from '../models/task.model';
import { taskSchema } from '../schemas/task.schema';
import { ZodError } from 'zod';

export const  addNewTask = async (req: Request, res: Response) => {
    try {
        const {title,description,deadline} = taskSchema.parse(req.body);
        const task: ITask = {title,description,deadline} as ITask;
        const newTask = await createTask(task);
        res.status(201).json(newTask);
    } catch (e:any) {
        res.status(400).json({message: e.message});
    }
}
export const getTaskById = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        console.log(id);
        const task = await findTaskById(id);
        if(!task){
            return res.status(404).json({message: 'Task not found'});
        }
        res.status(200).json(task);
    } catch (e:any) {
        if(e.message === 'Task not found'){
            return res.status(404).json({message: e.message});
        }
        res.status(400).json({message: e.message});
    }
}

export const getTaskByTitle = async (req: Request, res: Response) => {
    try {
        const title: string = req.params.title;
        const task = await findTaskByTitle(title);
        if(!task){
            return res.status(404).json({message: 'Task not found'});
        }
        res.status(200).json(task);
    } catch (e:any) {
        if(e.message === 'Task not found'){
            return res.status(404).json({message: e.message});
        }
        res.status(400).json({message: e.message});
    }
}

export const updateTaskById = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const { title, description, deadline } = taskSchema.parse(req.body);
        const task: ITask = { title, description, deadline } as ITask;
        
        const updatedTask = await updateTask(id, task);

        if (!updatedTask ) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(updatedTask);
    } catch (e: any) {
        if(e.message === 'Task not found'){
            return res.status(404).json({message: e.message});
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const deleteTaskById = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const deletedTask = await deleteTask(id);
        res.status(200).json(deletedTask);
    } catch (e:any) {
        if(e.message === 'Task not found'){
            return res.status(404).json({message: e.message});
        }
        res.status(400).json({message: e.message});
    }
}

export const getAllTasks = async (req: Request, res: Response) => { 
    try{
        const tasks = await getTasks();
        res.status(200).json(tasks);
    }
    catch(e:any){
        res.status(400).json({message: e.message});
    }
}
