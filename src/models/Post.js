const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const PostSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Por favor pon título a tu Post"],
    },
    text: {
      type: String,
      required: [true, "Por favor escribe algo en el contenido Post"],
    },
    visibility: String, // public | private | friends
    userId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    image: { type: String },
    likes: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

PostSchema.index({
  name: "text",
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
