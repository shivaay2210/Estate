import { Chat } from "../models/chat.models.js";
import { User } from "../models/user.models.js";
import { Message } from "../models/message.models.js";

// export const getChats = async (req, res) => {
//   const tokenUserId = req.userId;

//   try {
//     // Find chats where the user is a participant
//     const chats = await Chat.find({
//       userIDs: { $in: [tokenUserId] },
//     });

//     // Populate receiver information for each chat
//     for (const chat of chats) {
//       const receiverId = chat.userIDs.find(
//         (id) => id.toString() !== tokenUserId
//       );

//       console.log(receiverId);

//       if (receiverId) {
//         console.log("success");
//         const receiver = await User.findById(receiverId).select(
//           "_id username avatar"
//         );
//         const obj = receiver ? receiver.toObject() : null;
//         console.log(obj);
//         chat.receiver = receiver;
//       }
//     }

//     res.status(200).json(chats);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get chats!" });
//   }
// };

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    // Find chats where the user is a participant
    const chats = await Chat.find({
      userIDs: { $in: [tokenUserId] },
    });

    // Create an array to store the updated chat objects
    const updatedChats = [];

    // Populate receiver information for each chat
    for (const chat of chats) {
      // Find the receiver ID (the other participant)
      const receiverId = chat.userIDs.find(
        (id) => id.toString() !== tokenUserId
      );

      // Convert chat document to plain JavaScript object
      const chatObject = chat.toObject();

      if (receiverId) {
        const receiver = await User.findById(receiverId).select(
          "_id username avatar"
        );
        chatObject.receiver = receiver ? receiver.toObject() : null;
      }

      // Push the modified chat object to the array
      updatedChats.push(chatObject);
    }

    // Send the updated chats array with receiver info
    res.status(200).json(updatedChats);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

export const getChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    // Find the chat by ID and ensure the user is a participant
    const chat = await Chat.findOne({
      _id: req.params.id,
      userIDs: { $in: [tokenUserId] },
    }).populate({
      path: "messages",
      options: { sort: { createdAt: 1 } }, // Sort messages by creation date
    });

    // Update seenBy field to include the user
    if (chat) {
      chat.seenBy.addToSet(tokenUserId);
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    // Create a new chat document
    const newChat = await Chat.create({
      userIDs: [tokenUserId, req.body.receiverId],
    });
    res.status(200).json(newChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    // Update the chat document to include the user in seenBy
    const chat = await Chat.findOneAndUpdate(
      {
        _id: req.params.id,
        userIDs: {
          $in: [tokenUserId],
        },
      },
      {
        $addToSet: {
          seenBy: tokenUserId,
        },
      }, // Add to set to prevent duplicates, push will create duplicates
      {
        new: true,
      } // Return the updated document
    );

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};
