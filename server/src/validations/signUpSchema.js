const yup = require('./settings');

const signUpSchema = yup.object().shape({
  nome: yup.string().required(),
  email: yup.string().required().email(),
  senha: yup.string().required().min(8),
});

module.exports = signUpSchema;
