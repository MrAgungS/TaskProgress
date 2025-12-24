import express from "express";
import cors from "cors"
import authRouters from "./routes/authRoutes.js";
import taskRouters from "./routes/taskRoutes.js";
import Sequelize from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";


const app = express();
const PORT = process.env.PORT;


app.use("api/auth", authRouters);
app.use("api/task", taskRouters);
app.use(rateLimiter)

// Just for development
// (async () => {
//   try {
//     await Sequelize.sync({ alter: true });
//     console.log("DB synced");
//   } catch (err) {
//     console.error("Sync error:", err);
//   }
// })();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))


app.listen(PORT, () =>{
    console.log(`Started to localhost:${PORT}`);
});