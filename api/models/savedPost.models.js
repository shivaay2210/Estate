import mongoose from "mongoose";

const savedPostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  // {
  // indexes: [{ fields: { userId: 1, postId: 1 }, unique: true }],
  // This means a user can save a specific post only once, preventing duplicates in the SavedPost collection.
  // This creates a compound index on the combination of userId and postId and ensures that each combination of userId and postId is unique.
  // },
  {
    timestamps: true,
  }
);

// alternative to indexes : using preSave hook
savedPostSchema.pre("save", async function (next) {
  const exists = await mongoose.models.SavedPost.findOne({
    userId: this.userId,
    postId: this.postId,
  });

  if (exists) {
    throw new Error("This combination of userId and postId already exists");
  }

  next();
});

export const SavedPost = mongoose.model("SavedPost", savedPostSchema);
