import prisma from "../lib/prisma.js";
import bcrypt from 'bcrypt'

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
    console.log("getUsers se users mil gye")
  } catch (err) {
    console.log("getUsers se users nhi mil rhe user controller mai")
    console.log(err);
    res.status(500).json({ message: "Failed to get users !" });
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    res.status(200).json(user);
    console.log("Jo user chahiye tha woh mil gya less go")

  } catch (err) {
    console.log("Jo user chahiye tha woh nhi mila saddd life")

    console.log(err);
    res.status(500).json({ message: "Failed to get user!" });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId; // authorization
  const { password, avatar, ...inputs } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  let updatedPassword = null;
  try {
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
      },
    });

    const { password: userPassword, ...rest } = updatedUser;

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
    await prisma.savedPost.deleteMany({
      where: { userId: id },
    });

    // Delete related PostDetail records through posts
    const posts = await prisma.post.findMany({
      where: { userId: id },
      select: { id: true }
    });

    for (const post of posts) {
      await prisma.postDetail.deleteMany({
        where: { postId: post.id },
      });
    }

    // Delete related Post records
    await prisma.post.deleteMany({
      where: { userId: id },
    });

    // Update related Chat records to remove the user from the chat
    const chats = await prisma.chat.findMany({
      where: { userIDs: { has: id } },
    });

    for (const chat of chats) {
      // Remove the user from the chat
      await prisma.chat.update({
        where: { id: chat.id },
        data: {
          userIDs: {
            set: chat.userIDs.filter((userId) => userId !== id),
          },
        },
      });

      // If the chat has no more users, delete it
      if (chat.userIDs.length === 1) {
        await prisma.chat.delete({
          where: { id: chat.id },
        });
      }
    }

    // Delete the user
    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: "User and related data deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete user and related data!" });
  }
};

export const savePost = async(req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId
        }
      }
    });

    if(savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id
        }
      });
      res.status(200).json({ message: "Post removed from saved list" })
    }
    else {
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId
        }
      });
      res.status(200).json({ message: "Post saved" })
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

export const profilePosts = async(req, res) => {
    const tokenUserId = req.params.userId;
    try {
      const userPosts = await prisma.post.findMany({
        where: { userId: tokenUserId },
      });

      const saved = await prisma.savedPost.findMany({
        where: { userId: tokenUserId },
        include: {
          post: true
        }
      });
  
      const savedPosts = saved.map(item => item.post) // return the post array
      res.status(200).json({userPosts, savedPosts})
  
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to get profile posts!" });
    }
}

export const getNotificationNumber = async(req, res) => {
  const tokenUserId = req.userId
  try {
    const number = await prisma.chat.count({
      where: {
        userIDs: {
          hasSome: [tokenUserId]
        },
        NOT: {
          seenBy: {
            hasSome: [tokenUserId]
          }
        }
      }
    })
    res.status(200).json(number)
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "failed to get profile posts!"})
  }
}