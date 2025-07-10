import express from "express";
import { checkAuth, updateProfile, userLogin, userSignUp } from "../controllers/user.controllers";
import { protectRoute } from "../middlewares/auth.middlewares";

const userRouter = express.Router()

userRouter.post("/signup", userSignUp)
userRouter.post("/login", userLogin)
userRouter.put("/update-profile", protectRoute, updateProfile)
userRouter.get("/check", protectRoute, checkAuth)


export default userRouter