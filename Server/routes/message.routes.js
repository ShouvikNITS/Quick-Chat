import express from 'express';
import { protectRoute } from '../middlewares/auth.middlewares';
import { getMessages, getUsersForSidebar, markMessageAsSeen } from '../controllers/msg.controllers';

const messageRouter = express.Router()

messageRouter.get("/users", protectRoute, getUsersForSidebar)
messageRouter.get("/:id", protectRoute, getMessages)
messageRouter.put("mark/:id", protectRoute, markMessageAsSeen)

export default messageRouter