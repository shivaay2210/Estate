import { Chat } from "../models/chat.models.js";
import { Message } from "../models/message.models.js";

export const addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId; // chatId because i named this as chatId inside message route
  const text = req.body.text;

  try {
    // Find the chat to ensure it exists and the user is a participant
    const chat = await Chat.findOne({
      _id: chatId,
      userIDs: {
        $in: [tokenUserId],
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const message = await Message.create({
      text,
      chatId,
      userId: tokenUserId,
    });

    // const normalObj = message.toObject();

    // console.log(normalObj);

    // Update chat
    chat.messages.push(message);
    chat.seenBy = [tokenUserId]; // Reset seenBy to only the current user
    chat.lastMessage = text; // Update the lastMessage field

    await chat.save();

    res.status(200).json(message);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add message!" });
  }
};
