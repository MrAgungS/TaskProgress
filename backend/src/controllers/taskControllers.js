import express from "express"

import { Tasks } from "../models/association.js"
import authMiddleware from "../middleware/auth.middleware.js"
import response from "../responses/response.js";

const router = express.Router();

router.use(authMiddleware);

export const getTasks = async (req, res) => {
    try {
        const where = {};
    
        if (req.user.role !== "admin") {
            where.user_id = req.user.id;
        }
    
        const tasks = await Tasks.findAll({ where });
        response(200,"Success get task", tasks, res)
    } catch (error) {
        console.log(error);
        response(500,"Get task Error", null, res); 
    }
}
export const createTask = async (req, res) => {
    try {
        const { title, description, priority, due_date} = req.body
        
        const tasks = await Tasks.create({
            title,
            description,
            priority,
            due_date,
            user_id: req.user.id
        })
        response(200,"Success create tasks", tasks, res)
    } catch (error) {
        console.log(error);
        response(500,"Create task Error", null, res); 
    }
}
export const getTaskById = async (req, res) => {
    try {
        const where = {id: req.params.id}
        if (req.user.role !== "admin") {
            where.user_id = req.user.id;
        }   
        
        const tasks = await Tasks.findOne({ where });
        
        if (!tasks) {
            return response(404,"Tasks not find", null, res )
        }
        response(200,"Success find tasks", tasks, res)
    } catch (error) {
        console.log(error);
        response(500,"Find task Error", null, res); 
    }
}
export const updateTask = async (req, res) => {
    try {        
        const tasks = await Tasks.findOne({ where:{
            id: req.params.id,
            user_id: req.user.id
        } });
        if (!tasks) {
            return response(404,"Tasks not find", null, res )
        }
        await tasks.update(req.body);
        res.json(tasks);
    } catch (error) {
        console.log(error);
        response(500,"Update task Error", null, res); 
    }
}
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Tasks.findOne({
      where: { id, user_id: req.user.id },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await task.destroy();

    return res.status(200).json({
      success: true,
      message: "Task deleted",
    });

  } catch (err) {
    console.error("DELETE TASK ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Delete task error",
    });
  }
};
