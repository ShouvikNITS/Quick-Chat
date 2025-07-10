import cloudinary from "../lib/cloudinary"
import { Msg } from "../models/msg.models"
import { User } from "../models/user.models"
import { io, userSocketMap } from "../server"

const getUsersForSidebar = async() => {
    try {
        const userId = req.user._id
        const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password")

        const unseenMsg = {}
        const promises = filteredUsers.map(async(user) => {
            const messages = await Msg.find({senderId: user._id, receiverId: userId, seen: false})
            if(messages.length > 0) {
                unseenMsg[user._id] = messages.length
            }
        })
        await promises.all(promises)
        res.json({success: true, users: filteredUsers, unseenMsg})
    } catch (error) {
        res.json({success: false, message: error.message})        
    }
}

const getMessages = async(req, res) => {
    try {
        const { id:selectedUserId } = req.params
        const myId = req.user._id

        const messages = await Msg.find(
            {
                $or: [
                    {
                        senderId: myId,
                        receiverId: selectedUserId
                    },
                    {
                        senderId: selectedUserId,
                        receiverId: myId
                    },
                ]
            }
        )

        await Msg.updateMany({senderId: selectedUserId, receiverId: myId}, {seen: true})

        res.json({success: true, messages})
    } catch (error) {
        res.json({success: false, message: error.message}) 
    }
}

const markMessageAsSeen = async (req, res) => {
    try {
        const {id} = req.params
        await Msg.findByIdAndUpdate(id, {seen: true})
        res.json({success: true})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

const sendMessage = async(req, res) => {
    try {
        const {text, image} = req.body

        const receiverId = req.params.id
        const senderId = req.user._id

        let imageUrl
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = await Msg.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        const receiverSocketId = userSocketMap[receiverId]
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.json({success: true, newMessage})



    } catch (error) {
        res.json({success: false, message: error.message})
    }
}


export {getUsersForSidebar, getMessages, markMessageAsSeen, sendMessage}