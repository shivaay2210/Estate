import mongoose from "mongoose";

const postDetailSchema = new mongoose.Schema({
  desc: {
    type: String,
  },
  utilities: {
    type: String,
  },
  pet: {
    type: String,
  },
  income: {
    type: String,
  },
  size: {
    type: Number,
  },
  school: {
    type: Number,
  },
  bus: {
    type: Number,
  },
  restaurant: {
    type: Number,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    unique: true,
    required: true,
  },
});

export const PostDetail = mongoose.model("PostDetail", postDetailSchema);
