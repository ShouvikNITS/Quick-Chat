import { jwt } from "jsonwebtoken";

export const generateToken = (userId) => {
    return token =jwt.sign({userId}, process.env.JWT_SECRET)
}