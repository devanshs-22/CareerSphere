import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from "cors";
import userRouter from './routes/user.routes.js';
import postRouter from './routes/post.routes.js';
import connectionRouter from './routes/connection.routes.js';
import http from "http"
import { Server } from "socket.io";

dotenv.config();
let app = express();
let server=http.createServer(app)
export const io=new Server(server,{
    cors:({
    origin:"http://localhost:5173",
    credentials: true
    })
})
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}));
let port = process.env.PORT || 5000;
app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.use("/api/post",postRouter);
app.use("/api/connection",connectionRouter)
export const userSocketMap=new Map()

io.on("connection", (socket) => {
    socket.on("register", (userId) => {
        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(userSocketMap);
        }
    });

    socket.on("disconnect", () => {
        // Find the userId for this socket
        for (let [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                console.log("User disconnected:", userId);
                break;
            }
        }
    });
});

app.get('/', (req, res) => {
    res.send("Hello World");
})

server.listen(port, () => {
    connectDb();
    console.log("Server starts");
})