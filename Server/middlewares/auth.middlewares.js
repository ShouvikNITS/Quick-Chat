import { User } from "../models/user.models.js";

const protectRoute = async(req, res, next) => {
    try {
        const token = req.headers.token;

        const decoded = JsonWebTokenError.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.userId).select(
            "-password"
        )

        if(!user){
            return res.json({sucess: false, message: "User not found"})
        }

        req.user = user;

        next();

    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export {protectRoute}