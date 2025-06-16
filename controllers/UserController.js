const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/keys.js");
const bcrypt = require("bcryptjs");

const UserController = {
  //REGISTER
  async register(req, res) {
    try {
      const existingUser = await User.findOne({
        email: req.body.email,
      });
      if (existingUser) {
        return res.status(409).send({ message: "El email ya está registrado" });
      }

      if (req.body.password.length < 6 || req.body.password.length > 16) {
        return res.status(400).send({
          message: "La contraseña debe tener entre 6 y 16 caracteres",
        });
      }

      const passwordEncrypted = bcrypt.hashSync(req.body.password, 10);

      const newUser = await User.create({
        ...req.body,
        password: passwordEncrypted,
      });
      res
        .status(201)
        .send({ message: "Usuario registrado con exito", newUser });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Ha habido un problema al registrar el usuario",
        error,
      });
    }
  },

  //LOGIN
  async login(req, res) {
    try {
      const user = await User.findOne({
        email: req.body.email,
      });
      const isMatch = bcrypt.compareSync(req.body.password, user.password);

      if (!user || !isMatch) {
        return res
          .status(400)
          .send({ message: "Usuario o contraseña incorrectos" });
      }

      const token = jwt.sign({ _id: user._id }, jwt_secret);
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
};
module.exports = UserController;
