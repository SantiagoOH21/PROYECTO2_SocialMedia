const express = require("express");
const router = express.Router();
const PostController = require("../controllers/PostController");
const { authentication } = require("../middlewares/authentication");

router.post("/", authentication, PostController.create);
router.get("/", PostController.getAll);
router.get("/id/:id", PostController.getById);
router.get("/name/:name", PostController.getByName);
router.delete("/:id", authentication, PostController.delete);
router.put("/:id", authentication, PostController.update);
router.put("/likes/:id", authentication, PostController.like);
router.put("/unlike/:id", authentication, PostController.unlike);

module.exports = router;
