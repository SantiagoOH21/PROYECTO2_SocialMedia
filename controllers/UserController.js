const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");

const UserController = {
  //REGISTER
  async register(req, res, next) {
    try {
      const existingUser = await User.findOne({
        email: req.body.email,
      });
      if (existingUser) {
        return res.status(409).send({ message: "El email ya está registrado" });
      }

      if (
        !req.body.password ||
        req.body.password.length < 6 ||
        req.body.password.length > 16
      ) {
        return res.status(400).send({
          message: "La contraseña debe tener entre 6 y 16 caracteres",
        });
      }

      const passwordEncrypted = req.body.password
        ? bcrypt.hashSync(req.body.password, 10)
        : undefined;

      const newUser = await User.create({
        ...req.body,
        role: "user",
        password: passwordEncrypted,
      });
      res
        .status(201)
        .send({ message: "Usuario registrado con exito", newUser });
    } catch (error) {
      error.origin = "usuario";
      next(error);
    }
  },

  //LOGIN
  async login(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });
      const isMatch = bcrypt.compareSync(req.body.password, user.password);

      if (!user || !isMatch) {
        return res
          .status(400)
          .send({ message: "Usuario o contraseña incorrectos" });
      }

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      if (user.tokens.length > 3) user.tokens.shift();
      user.tokens.push(token);
      await user.save();
      res.send({ message: "Bienvenid@ " + user.name, token });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Error al iniciar sesión",
        error,
      });
    }
  },

  //LOGOUT
  async logout(req, res) {
    try {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { tokens: req.headers.authorization },
      });
      res.status(200).send({ message: "Desconectado con éxito" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Hubo un problema al intentar desconectar al usuario",
      });
    }
  },
};
module.exports = UserController;
