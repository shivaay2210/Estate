// import { Server } from "socket.io";

// const io = new Server({
//   cors: {
//     origin: "http://localhost:5173",
//   },
// });

// let onlineUser = [];

// const addUser = (userId, socketId) => {
//   const userExits = onlineUser.find((user) => user.userId === userId);
//   if (!userExits) {
//     onlineUser.push({ userId, socketId });
//   }
// };

// const removeUser = (socketId) => {
//   onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
// };

// const getUser = (userId) => {
//   return onlineUser.find((user) => user.userId === userId);
// };

// io.on("connection", (socket) => {
//   socket.on("newUser", (userId) => {
//     addUser(userId, socket.id);
//   });

//   socket.on("sendMessage", ({ receiverId, data }) => {
//     const receiver = getUser(receiverId);
//     io.to(receiver.socketId).emit("getMessage", data);
//   });

//   socket.on("disconnect", () => {
//     removeUser(socket.id);
//   });
// });

// io.listen("4000");

import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});


const port = process.env.PORT;

const io = new Server({
  cors: {
    origin: "https://estate-psi-roan.vercel.app",
  },
});

let onlineUser = [];

// Add user to the onlineUser list or update their socketId if already connected
const addUser = (userId, socketId) => {
  const user = onlineUser.find((user) => user.userId === userId);
  if (user) {
    // Update socketId if user already exists (handles reconnections)
    user.socketId = socketId;
    console.log(`Updated socketId for user ${userId}`);
  } else {
    // Otherwise, add a new user
    onlineUser.push({ userId, socketId });
    console.log(`User added: ${userId}, Socket ID: ${socketId}`);
  }
};

// Remove user from the onlineUser list
const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
  console.log(`User with Socket ID: ${socketId} removed`);
};

// Get a user by userId
const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // When a new user connects
  socket.on("newUser", (userId) => {
    console.log(`New user: ${userId}`);
    addUser(userId, socket.id);
  });

  // When a message is sent
  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);

    if (receiver) {
      console.log(`Message sent to receiver: ${receiverId}`);
      io.to(receiver.socketId).emit("getMessage", data);
    } else {
      console.error(`Receiver with ID: ${receiverId} not found or not online.`);
      // Optionally notify the sender or handle offline messages here
    }
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
    removeUser(socket.id);
  });
});

io.listen(port);