import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { log } from "console";
import { connectDb } from "./lib/db.js";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";
import { Server } from "socket.io";


const app = express();

const server = http.createServer(app)

const io = new Server(server, {
    cors: {origin: "*"}
})

const userSocketMap = {}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId
    console.log("User Connected", userId)

    if(userId) userSocketMap[userId] = socket.id

    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        console.log("User disconnected", userId);
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})


app.use(express.json({limit: "10mb"}));
app.use(cors())


app.use("/api/status", (req, res) => {
    res.send("Server is live")
})
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter)



await connectDb()



server.listen(process.env.PORT || 5000, () => {
    console.log(`Server is live at port: ${process.env.PORT || 5000}`);
})


export {io, userSocketMap}