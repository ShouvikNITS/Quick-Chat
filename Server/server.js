import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { log } from "console";
import { connectDb } from "./lib/db.js";


const app = express();

const server = http.createServer(app)

app.use(express.json({limit: "10mb"}));
app.use(cors())


app.use("/api/status", (req, res) => {
    res.send("Server is live")
})

await connectDb()



server.listen(process.env.PORT || 5000, () => {
    console.log(`Server is live at port: ${process.env.PORT || 5000}`);
})