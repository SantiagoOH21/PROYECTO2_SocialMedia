const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/CommentController");
const { authentication } = require("../middlewares/authentication");

router.post("/", authentication, CommentController.create);
router.get("/", CommentController.getAll);
router.put("/likes/:_id", authentication, CommentController.like);

module.exports = router;
