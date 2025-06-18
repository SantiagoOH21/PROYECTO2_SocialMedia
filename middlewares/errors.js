const handleValidationError = (err, res) => {
  let errors = Object.values(err.errors).map((el) => el.message);
  //   if (errors.length > 1) {
  let chain = errors[0];
  for (let i = 1; i < errors.length; i++) {
    chain += " || " + errors[i];
  }
  // const string = chain.slice(0, -4);
  res.status(400).send({ messages: chain });
  //   }
};
const typeError = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    return (err = handleValidationError(err, res));
  } else if (err.code === 11000) {
    res.status(400).send("El correo tiene que ser único");
  } else {
    console.error(err);
    res.status(500).send(`Hubo un problema`);
  }
};
module.exports = { typeError };
