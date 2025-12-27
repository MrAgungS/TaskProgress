import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"

import authRouters from "./routes/authRoutes.js";
import taskRouters from "./routes/taskRoutes.js";
import rateLimiter from "./middleware/rateLimiter.js";


const app = express();
const PORT = process.env.PORT;


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
// This enables Express to handle JSON data sent in the request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/auth", authRouters);
app.use(rateLimiter);
app.use("/api/tasks", taskRouters);



// Just for development
// (async () => {
//   try {
//     await Sequelize.sync({ alter: true });
//     console.log("DB synced");
//   } catch (err) {
//     console.error("Sync error:", err);
//   }
// })();




app.listen(PORT, () =>{
    console.log(`Started to localhost:${PORT}`);
});