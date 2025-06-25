const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/CommentController");
const Comment = require("../models/Comment");
const {
  authentication,
  isAuthorOrAdmin,
} = require("../middlewares/authentication");
const upload = require("../middlewares/upload");

router.post(
  "/",
  authentication,
  upload.single("image"),
  CommentController.create
);
router.get("/", CommentController.getAll);
router.put(
  "/:id",
  authentication,
  isAuthorOrAdmin(Comment, "userId", "id"),
  upload.single("image"),
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
