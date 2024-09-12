import { Post } from "../models/post.models.js";
import { PostDetail } from "../models/postDetail.models.js";
import { SavedPost } from "../models/savedPost.models.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  const query = req.query;
  // console.log(query);

  let filter = {};

  if (query.city) filter.city = query.city;
  if (query.type) filter.type = query.type;
  if (query.property) filter.property = query.property;
  if (query.bedroom) filter.bedroom = parseInt(query.bedroom);

  filter.price = {
    $gte: query.minPrice ? parseInt(query.minPrice) : 0,
    $lte: query.maxPrice ? parseInt(query.maxPrice) : 100000,
  };

  try {
    const posts = await Post.find(filter);
    const plainPosts = posts.map((post) => post.toObject());
    console.log(plainPosts);
    // console.log(posts);
    res.status(200).json(plainPosts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  console.log(id);

  try {
    const post = await Post.findById(id).populate("postDetail").populate({
      path: "userId",
      select: "username avatar",
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // console.log("decodedToken:: ", token);

    const savedPost = await SavedPost.findOne({
      userId: req.userId,
      postId: id,
    });

    console.log("saved post lelo", savedPost);

    const isSaved = savedPost ? true : false;

    return res.status(200).json({ ...post.toObject(), isSaved });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const newPost = await Post.create({
      ...body.postData,
      userId: tokenUserId,
    });

    if (body.postDetail) {
      const postDetail = await PostDetail.create({
        ...body.postDetail,
        postId: newPost._id,
      });

      newPost.postDetail = postDetail._id;
      await newPost.save();
    }

    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const post = await Post.findById(id).populate("postDetail");
  console.log(post);
  try {
    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update posts" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  // console.log(tokenUserId);

  try {
    const post = await Post.findById(id).populate("postDetail");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!post.userId) {
      return res
        .status(404)
        .json({ message: "Post does not have an associated user" });
    }

    if (post.userId.toString() !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    // Delete related PostDetail
    if (post.postDetail) {
      await PostDetail.findByIdAndDelete(post.postDetail._id);
    }

    // Delete the Post
    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};
