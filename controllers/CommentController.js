const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

const CommentController = {
  //CREATE
  async create(req, res) {
    try {
      const { postId, content } = req.body;

      if (!content)
        return res
          .status(400)
          .send({ message: "El comentario no puede estar vacío" });

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).send({ message: "Post no encontrado" });
      }

      const newComment = await Comment.create({
        content,
        postId,
        userId: req.user._id,
      });

      await Post.findByIdAndUpdate(postId, {
        $push: { comments: newComment._id },
      });

      res
        .status(201)
        .send({ message: "Comentario creado correctamente", newComment });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Ha habido un problema al crear el comentario",
        error,
      });
    }
  },

  //GET ALL
  async getAll(req, res) {
    try {
      const comments = await Comment.find().populate("userId", "name");
      res.status(200).send(comments);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Ha habido un problema traer los comentarios",
        error,
      });
    }
  },

  //UPDATE
  async update(req, res) {
    try {
      const commentId = req.params.id;
      const comment = await Comment.findById(commentId);
      if (!comment)
        return res.status(404).send({ message: "Comentario no encontrado" });

      await Comment.findByIdAndUpdate(commentId, req.body, {
        new: true,
      });

      res.send({ message: "Comentario actualizado correctamente", comment });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Ha habido un problema al intentar actualizar el post",
      });
    }
  },

  //DELETE
  async delete(req, res) {
    try {
      const commentId = req.params.id;
      const comment = await Comment.findById(commentId);

      if (!comment)
        return res.status(404).send({ message: "Comentario no encontrado" });

      await Comment.findByIdAndDelete(commentId);
      await Post.findByIdAndUpdate(comment.postId, {
        $pull: { comments: commentId },
      });

      res.status(200).send({ message: "Comentario borrado con éxito" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Ha habido un problema al intentar borrar el comentario",
      });
    }
  },

  //LIKE
  async like(req, res) {
    try {
      const comment = await Comment.findByIdAndUpdate(
        req.params._id,
        { $addToSet: { likes: req.user._id } },
        { new: true }
      );

      if (!comment)
        return res.status(404).send({ message: "Comentario no encontrado" });

      res.send({ message: "Like agregado correctamente", comment });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Ha habido un problema con tu petición", error });
    }
  },

  //UNLIKE
  async unlike(req, res) {
    try {
      const comment = await Comment.findByIdAndUpdate(
        req.params._id,
        { $pull: { likes: req.user._id } },
        { new: true }
      );

      if (!comment) {
        return res.status(404).send({ message: "Comentario no encontrado" });
      }

      res.send({ message: "Like eliminado correctamente", comment });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Ha habido un problema al quitar el like", error });
    }
  },
};
module.exports = CommentController;
