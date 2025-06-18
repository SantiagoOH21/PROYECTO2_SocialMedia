const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Por favor rellena tu nombre"],
      match: [
        /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]+(?:[-' ][a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]+)*$/,
        "El nombre contiene caracteres inválidos.",
      ],
    },
    email: {
      type: String,
      required: [true, "Por favor rellena tu correo"],
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "El correo electrónico no es válido.",
      ],
    },
    password: {
      type: String,
      required: [true, "Por favor rellena tu contraseña"],
    },

    age: {
      type: Number,
      required: [true, "Por favor rellena tu edad"],
    },
    role: String,
    tokens: [],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
