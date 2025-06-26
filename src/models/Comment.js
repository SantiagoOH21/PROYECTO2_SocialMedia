const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: ObjectId,
      ref: "Post",
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Por favor escribe algo en el contenido del comentario"],
    },
    image: { type: String },
    likes: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

CommentSchema.index({
  content: "text",
});

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
