import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken"; // <-- Correct import

const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.token;
        if (!token) {
            return res.json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // <-- Correct usage

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.json({ success: false, message: "User not found" }); // <-- Fixed typo
        }

        req.user = user;
        next();

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export { protectRoute };