const User = require("../models/User");
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: payload._id, tokens: token });
    if (!user) {
      return res.status(401).send({ message: "No estás autorizado" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error, message: "Ha habido un problema con el token" });
  }
};

const isAuthorOrAdmin = (Model, userField = "userId", paramId = "id") => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramId];
      const resource = await Model.findById(resourceId);
      if (!resource)
        return res
          .status(404)
          .send({ message: "Recurso no encontrado con esa id" });

      const isAuthor =
        resource[userField].toString() === req.user.id.toString();
      const isAdmin = ["admin", "superadmin"].includes(req.user.role);

      if (!isAuthor && !isAdmin) {
        return res
          .status(403)
          .send({ message: "No tienes permiso para realizar esta acción" });
      }
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        error,
        message: "Error al verificar los permisos del recurso",
      });
    }
  };
};

module.exports = { authentication, isAuthorOrAdmin };
