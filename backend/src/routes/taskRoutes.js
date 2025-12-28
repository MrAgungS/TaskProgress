import express from "express";
import { createTask, deleteTask, getTaskById, getTasks, updateTask } from "../controllers/taskControllers.js ";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware(["user", "admin"]), getTasks);
router.post("/", authMiddleware, roleMiddleware(["user", "admin"]), createTask);
router.get("/:id",authMiddleware, roleMiddleware(["admin", "user"]), getTaskById);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id",authMiddleware, roleMiddleware(["user"]), deleteTask);

export default router