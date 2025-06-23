const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

const CommentController = {
  //CREATE
  async create(req, res) {
    try {
      const { postId } = req.body;
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).send({ message: "Post no encontrado" });
      }

      const comment = await Comment.create({
        ...req.body,
        userId: req.user._id,
      });

      res
        .status(201)
        .send({ message: "Comentario creado correctamente", comment });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Ha habido un problema al crear el comentario",
        error,
      });
    }
  },

  //LIKE
  async like(req, res) {
    try {
      const comment = await Comment.findByIdAndUpdate(
        req.params._id,
        { $push: { likes: req.user._id } },
        { new: true }
      );
      res.send(comment);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Ha habido un problema con tu petición", error });
    }
  },
};
module.exports = CommentController;
