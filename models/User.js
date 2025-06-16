const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      match: [
        /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]+(?:[-' ][a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]+)*$/,
        "El nombre contiene caracteres inválidos.",
      ],
    },
    email: {
      type: String,
      required: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "El correo electrónico no es válido.",
      ],
    },
    password: String,
    age: Number,
    tokens: [],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
