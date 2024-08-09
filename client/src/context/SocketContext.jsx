import { createContext, useContext, useEffect, useState } from "react"
import {io} from "socket.io-client"
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketContextProvider = ({children}) => {
    const {currentUser} = useContext(AuthContext)

    const [socket, setSocket] = useState(null)

    useEffect(() => {
        setSocket(io("https://estate-socket-25u0.onrender.com"))
    }, []);

    useEffect(() => {
        currentUser && socket?.emit("new user", currentUser.id)
    }, [currentUser, socket]);
    
    console.log(socket);



    return (
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    )
}