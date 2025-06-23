const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

const PostController = {
  //CREATE
  async create(req, res) {
    try {
      const post = await Post.create({
        ...req.body,
        visibility: "public",
        userId: req.user._id,
      });
      res.status(201).send(post);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Ha habido un problema al crear el post" });
    }
  },

  //GET ALL POSTS
  async getAll(req, res) {
    try {
      const posts = await Post.find().populate("userId", "name");
      res.status(200).send(posts);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Ha habido un problema traer los posts", error });
    }
  },

  //GET BY ID
  async getById(req, res) {
    try {
      const post = await Post.findById(req.params.id).populate(
        "userId",
        "name"
      );
      res.status(200).send(post);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Ha habido un problema con ese post", error });
    }
  },

  //GET BY NAME (TITLE)
  async getByName(req, res) {
    try {
      if (req.params.name.length > 20) {
        return res.status(400).send("Búsqueda demasiado larga");
      }
      const posts = await Post.find({
        $text: {
          $search: req.params.name,
        },
      }).populate("userId", "name");

      res.status(200).send(posts);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Ha habido un problema con ese post", error });
    }
  },

  //DELETE
  async delete(req, res) {
    try {
      const post = await Post.findByIdAndDelete(req.params.id);
      res.status(200).send({ message: "Post borrado con éxito", post });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Ha habido un problema al intentar borrar el post",
      });
    }
  },

  //UPDATE
  async update(req, res) {
    try {
      const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.send({ message: "Post actualizado correctamente", post });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Ha habido un problema al intentar actualizar el post",
      });
    }
  },
};
module.exports = PostController;
