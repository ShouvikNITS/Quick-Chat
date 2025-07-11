import { createContext, useContext, useState } from "react"
import { AuthContext } from "./AuthContext";

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


    const value = {

    }
    return (
    <ChatContext.Provider value={}>
        {children}
    </ChatContext.Provider>
    )
}


export { ChatContext, ChatProvider}