import { generateToken } from "../lib/utils";
import { User } from "../models/user.models";
import bcrypt from "bcrypt";


const userSignUp = async(req, res) => {

    const [fullname, email, password, bio] = req.body;

    try {
        if(!fullname || !email || !password || !bio){
            return res.json({success: false, message: "Missing Details"})
        }


        const user = await User.findOne({email})
        if(user) {
            return res.json({success: false, message: "User with same email ID already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create(
            fullname,
            email,
            password = hashedPassword,
            bio
        )

        const token = generateToken(newUser._id)

        res.json({success: true,
            userData: newUser,
            token,
            message: "Account created successfully"
        })

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

const userLogin = async(req, res) => {

    const [email, password] = req.body;

    try {

        const userData = await User.findOne({email})

        if(!userData){
            return res.json({success: false, message: "No user exists"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password)

        if(!isPasswordCorrect) {
            return res.json({success: false, message: "Email or password is wrong"})
        }

        const token = generateToken(userData._id)

        res.json({success: true,
            userData,
            token,
            message: "Login successfully"
        })

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})        
    }
}

const checkAuth = async(req, res) => {
    res.json({success: true, user: req.user})
}





export {
    userSignUp,
    userLogin
};