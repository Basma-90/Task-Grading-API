import { Task,ITask } from "../models/task.model";
import { taskSchema } from "../schemas/task.schema";

export const createTask = async (task: ITask) => {
    try {
        let {title,description,deadline} = task;
        let newTask = new Task({title,description,deadline});
        await newTask.save();
        return newTask;
    } catch (e:any) {
        throw new Error(e.message);
    }
};

export const findTaskByTitle = async (title: string) => {
    try{
        return await Task.findOne({title:title});
    }catch(err:any){
        throw new Error(err.message);
    }
};

export const findTaskById = async (id: string) => {
    try{
        return await Task.findById(id);
    }catch(err:any){
        throw new Error(err.message);
    }
};

export const updateTask = async (id: string, task: ITask) => {
    try{
        return await Task.findByIdAndUpdate(id,task,{new:true});
    }
    catch(err:any){
        throw new Error(err.message);
    }
};

export const deleteTask = async (id: string) => {
    try{
        return await Task.findByIdAndDelete(id);
    }catch(err:any){
        throw new Error(err.message);
    }
};

export const getTasks = async () => {
    try{
        return await Task.find({});
    }catch(err:any){
        throw new Error(err.message);
    }
}