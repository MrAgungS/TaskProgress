import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"

import { loadEnv } from "./config/env.js";
import authRouters from "./routes/authRoutes.js";
import taskRouters from "./routes/taskRoutes.js";
import rateLimiter from "./middleware/rateLimiter.js";
import Sequelize from "./config/db.js";

import "./models/association.js"

loadEnv();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

// This enables Express to handle JSON data sent in the request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimiter);


app.use("/api/auth", authRouters);
app.use("/api/tasks", taskRouters);



await Sequelize.authenticate();
console.log("DB connected");




app.listen(PORT, () =>{
    console.log(`Started to localhost:${PORT}`);
});