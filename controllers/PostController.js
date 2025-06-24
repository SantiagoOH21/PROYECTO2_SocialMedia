const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

const PostController = {
  //CREATE
  async create(req, res, next) {
    try {
      const post = await Post.create({
        ...req.body,
        visibility: "public",
        userId: req.user._id,
      });
      res.status(201).send(post);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  //GET ALL POSTS
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageLimit = 10;
      const skipPage = (page - 1) * pageLimit;

      const [posts, totalPosts] = await Promise.all([
        Post.find()
          .sort({ createdAt: -1 })
          .skip(skipPage)
          .limit(pageLimit)
          .populate("userId", "name")
          .populate({
            path: "comments",
            populate: {
              path: "userId",
              select: "name",
            },
          })
          .lean(),
        Post.countDocuments(),
      ]);

      const totalPages = Math.ceil(totalPosts / pageLimit);

      res.status(200).send({
        posts,
        currentPage: page,
        totalPages,
        totalPosts,
      });
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
      const post = await Post.findById(req.params.id)
        .populate("userId", "name")
        .populate({
          path: "comments",
          populate: {
            path: "userId",
            select: "name",
          },
        });
      if (!post)
        return res
          .status(404)
          .send({ message: "Post no encontrado con esa id" });

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
      })
        .populate("userId", "name")
        .populate({
          path: "comments",
          populate: {
            path: "userId",
            select: "name",
          },
        });

      if (posts.length === 0)
        return res
          .status(404)
          .send({ message: "No se encontraron posts con ese título" });

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
      if (!post) return res.status(404).send({ message: "Post no encontrado" });
      res.status(200).send({ message: "Post borrado con éxito" });
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

      if (!post)
        return res
          .status(404)
          .send({ message: "Post no encontrado con esa id" });

      res.send({ message: "Post actualizado correctamente", post });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Ha habido un problema al intentar actualizar el post",
      });
    }
  },

  // LIKE
  async like(req, res) {
    try {
      const post = await Post.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { likes: req.user._id } },
        { new: true }
      );

      if (!post) {
        return res.status(404).send({ message: "Post no encontrado" });
      }

      res.send({ message: "Like agregado correctamente", post });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Ha habido un problema al dar like al post",
        error,
      });
    }
  },

  // UNLIKE
  async unlike(req, res) {
    try {
      const post = await Post.findByIdAndUpdate(
        req.params.id,
        { $pull: { likes: req.user._id } },
        { new: true }
      );

      if (!post) {
        return res.status(404).send({ message: "Post no encontrado" });
      }

      res.send({ message: "Like eliminado correctamente", post });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Ha habido un problema al quitar el like",
        error,
      });
    }
  },
};
module.exports = PostController;
