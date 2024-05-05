import { Children, createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketContextProvider = ({children}) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const user = useRecoilValue(userAtom);

    useEffect(() => {
        const socket = io("http://localhost:1000", {
            query: {
                userId: user?.user_id
            }
        }
    );

    setSocket(socket);

    socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
    })

    return () => socket && socket.close()

},[ user?.user_id])

console.log(onlineUsers, "Online users");

    return (
        <SocketContext.Provider value={{socket, onlineUsers}} >
            {children}
        </SocketContext.Provider>
    )
}