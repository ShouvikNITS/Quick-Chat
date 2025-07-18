import express from 'express';
import { protectRoute } from '../middlewares/auth.middlewares.js';
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from '../controllers/msg.controllers.js';

const messageRouter = express.Router()

messageRouter.get("/users", protectRoute, getUsersForSidebar)
messageRouter.get("/:id", protectRoute, getMessages)
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen)
messageRouter.post("/send/:id", protectRoute, sendMessage)

export default messageRouter