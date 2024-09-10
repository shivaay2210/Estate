// import { createContext, useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { AuthContext } from "./AuthContext";

// export const SocketContext = createContext();

// export const SocketContextProvider = ({ children }) => {
//   const { currentUser } = useContext(AuthContext);

//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     setSocket(io("http://localhost:4000"));
//   }, []);

//   useEffect(() => {
//     currentUser && socket?.emit("new user", currentUser._id);
//   }, [currentUser, socket]);

//   console.log(socket);

//   return (
//     <SocketContext.Provider value={{ socket }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext); // Getting the current user
  const [socket, setSocket] = useState(null); // State to hold the socket instance

  // Establish the socket connection when currentUser is available
  useEffect(() => {
    if (currentUser) {
      const newSocket = io("https://estate-socket-25u0.onrender.com"); // Connect to the socket server
      setSocket(newSocket);

      // Emit the new user event with currentUser's ID
      newSocket.emit("newUser", currentUser._id);

      // Optional: Logging for debugging
      console.log("Socket connected:", newSocket);
      console.log("Emitting newUser with user ID:", currentUser._id);

      // Clean up the socket connection when the component unmounts
      return () => {
        newSocket.disconnect();
        console.log("Socket disconnected");
      };
    }
  }, [currentUser]); // Only re-run the effect when currentUser changes

  // Add another useEffect to handle socket-specific events after it's established
  useEffect(() => {
    if (socket) {
      // Example: Listen for an event from the server
      socket.on("someServerEvent", (data) => {
        console.log("Data received from server:", data);
      });

      // Clean up event listeners on unmount
      return () => {
        socket.off("someServerEvent");
      };
    }
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
