const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const User = require("../models/User");
const {
  authentication,
  isAuthorOrAdmin,
} = require("../middlewares/authentication");
const upload = require("../middlewares/upload");

router.post("/register", upload.single("avatar"), UserController.register);
router.post("/login", UserController.login);
router.delete("/logout", authentication, UserController.logout);
router.get("/", UserController.getAll);
router.put(
  "/id/:id",
  authentication,
  isAuthorOrAdmin(User, "_id", "id"),
  upload.single("avatar"),
  UserController.update
);
router.delete(
  "/id/:id",
  isAuthorOrAdmin(User, "_id", "id"),
  UserController.delete
);
router.put("/follow/:id", authentication, UserController.follow);
router.put("/unfollow/:id", authentication, UserController.unfollow);
router.get("/followers/:id", UserController.getFollowers);
router.get("/following/:id", UserController.getFollowing);
router.get("/me", authentication, UserController.getMe);
router.get("/id/:id", UserController.getById);
router.get("/name/:name", UserController.getByName);

module.exports = router;
