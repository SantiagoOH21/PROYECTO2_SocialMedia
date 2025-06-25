const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/CommentController");
const Comment = require("../models/Comment");
const {
  authentication,
  isAuthorOrAdmin,
} = require("../middlewares/authentication");

router.post("/", authentication, CommentController.create);
router.get("/", CommentController.getAll);
router.put(
  "/:id",
  authentication,
  isAuthorOrAdmin(Comment, "userId", "id"),
  CommentController.update
);
router.delete(
  "/:id",
  authentication,
  isAuthorOrAdmin(Comment, "userId", "id"),
  CommentController.delete
);
router.put("/likes/:_id", authentication, CommentController.like);
router.put("/unlike/:_id", authentication, CommentController.unlike);

module.exports = router;
