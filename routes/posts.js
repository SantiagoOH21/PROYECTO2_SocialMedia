const express = require("express");
const router = express.Router();
const PostController = require("../controllers/PostController");
const Post = require("../models/Post");
const {
  authentication,
  isAuthorOrAdmin,
} = require("../middlewares/authentication");
const upload = require("../middlewares/upload");

router.post("/", authentication, upload.single("image"), PostController.create);
router.get("/", PostController.getAll);
router.get("/id/:id", PostController.getById);
router.get("/name/:name", PostController.getByName);
router.delete(
  "/:id",
  authentication,
  isAuthorOrAdmin(Post, "userId", "id"),
  upload.single("image"),
  PostController.delete
);
router.put(
  "/:id",
  authentication,
  isAuthorOrAdmin(Post, "userId", "id"),
  PostController.update
);
router.put("/likes/:id", authentication, PostController.like);
router.put("/unlike/:id", authentication, PostController.unlike);

module.exports = router;
