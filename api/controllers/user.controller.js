import { User } from "../models/user.models.js";
import { Post } from "../models/post.models.js";
import { PostDetail } from "../models/postDetail.models.js";
import { SavedPost } from "../models/savedPost.models.js";
import { Chat } from "../models/chat.models.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
    console.log("getUsers success");
  } catch (err) {
    console.log("getUsers error");
    console.log(err);
    res.status(500).json({ message: "Failed to get users !" });
  }
};

// accessing specific user only for testing
export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    // const user = await User.findOne({ _id: id });
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get user!" });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  // authorization
  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }
  const { password, avatar, ...inputs } = req.body;
  console.log(req.body);

  try {
    let updatedPassword = null;

    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    // const updateData = { ...inputs };
    // if (updatedPassword) {
    //   updateData.password = updatedPassword;
    // }
    // if (avatar) {
    //   updateData.avatar = avatar;
    // }

    const updateData = {
      ...inputs,
      ...(updatedPassword && { password: updatedPassword }),
      // If the result of updatedPassword && { password: updatedPassword } is an object, the spread operator will spread its properties into the surrounding object (i.e., updateData).
      // If the result is false, nothing is spread, and the object remains unchanged in this context
      ...(avatar && { avatar: avatar }),
    };

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true, // ensures that the function returns the updated document, not the original
    });

    const { password: userPassword, ...rest } = updatedUser.toObject();
    res.status(200).json(rest);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update users!" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  try {
    // Delete related SavedPost records
    await SavedPost.deleteMany({ userId: id });

    // Delete related PostDetail records through posts
    const posts = await Post.find({ userId: id });
    for (const post of posts) {
      if (post.postDetail) {
        await PostDetail.findByIdAndDelete(post.postDetail);
      }
    }

    // Delete related Post records
    await Post.deleteMany({ userId: id });

    // Update related Chat records to remove the user from the chat
    const chats = await Chat.find({ userIDs: id });
    for (const chat of chats) {
      // Remove the user from the chat
      await Chat.findByIdAndUpdate(chat._id, {
        $pull: { userIDs: id },
      });

      // If the chat has no more users, delete it
      if (chat.userIDs.length === 1) {
        await Chat.findByIdAndDelete(chat._id);
      }
    }

    // Delete the user
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Failed to delete user and related data!" });
  }
};

export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;
  console.log("Checking savePost ::", postId);
  try {
    const savedPost = await SavedPost.findOne({
      userId: tokenUserId,
      postId: postId,
    });

    if (savedPost) {
      await SavedPost.findByIdAndDelete(savedPost._id);
      res.status(200).json({ message: "Post removed from saved list" });
    } else {
      await SavedPost.create({
        userId: tokenUserId,
        postId: postId,
      });
      res.status(200).json({ message: "Post saved" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to save or remove post" });
  }
};

export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;
  console.log(tokenUserId);
  try {
    const userPosts = await Post.find({ userId: tokenUserId });

    const saved = await SavedPost.find({ userId: tokenUserId }).populate(
      "postId"
    );

    const savedPosts = saved.map((item) => item.postId);

    res.status(200).json({ userPosts, savedPosts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};

export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const number = await Chat.countDocuments({
      userIDs: tokenUserId,
      seenBy: { $ne: tokenUserId },
    });
    res.status(200).json(number);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get notification number!" });
  }
};
