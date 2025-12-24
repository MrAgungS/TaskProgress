import express from "express";
import { createTask, deleteTask, getTaskById, getTasks, updateTask } from "../controllers/taskControllers.js ";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware(["user", "admin"]), getTasks);
router.post("/", authMiddleware, roleMiddleware(["user", "admin"]), createTask);
router.get("/:id",authMiddleware, roleMiddleware(["admin"]), getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router