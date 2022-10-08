const yup = require('./settings');

const signInSchema = yup.object().shape({
  email: yup.string().required().email(),
  senha: yup.string().required().min(8),
});

module.exports = signInSchema;
