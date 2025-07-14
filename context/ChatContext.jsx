import { createContext, useContext, useEffect, useState } from "react"
import { AuthContext } from "./AuthContext.jsx";
import toast from "react-hot-toast";

const ChatContext = createContext();
const ChatProvider = ({children}) => {

    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [unseenMessages, setUnseenMessages] = useState({})


    const {socket, axios} = useContext(AuthContext)

    const getUsers = async () => {
        try {
            const {data} = await axios.get("/api/messages/users")
            

            if(data.success){
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
            else {
                setUsers([])
                setUnseenMessages({})
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getMessages = async (userId) => {
        try {
            const {data} = await axios.get(`/api/messages/${userId}`)
            if(data.success){
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const sendMsg = async (messageData) => {
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData)
            if(data.success){
                setMessages((prevMsg) => [
                    ...prevMsg, data.newMessage
                ])
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const subToMessage = () => {
        if(!socket) return;

        socket.on("newMessage", (newMessage) => {
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true
                setMessages((prevMsg) => [...prevMsg, newMessage])
                axios.put(`/api/messages/mark/${newMessage._id}`)
            }
            else{
                setUnseenMessages((prevUnseenMsg) => ({
                    ...prevUnseenMsg, [newMessage.senderId] : prevUnseenMsg[newMessage.senderId] ? prevUnseenMsg[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }



    const unsubFromMessage = ()=>{
        if(socket) {
            socket.off("newMessage")
        }
    }

    useEffect(() => {
        unsubFromMessage();
        subToMessage()
        return () => unsubFromMessage()
    }, [socket, selectedUser])


    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        setMessages,
        sendMsg,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages
    }
    return (
    <ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
    )
}


export { ChatContext, ChatProvider}