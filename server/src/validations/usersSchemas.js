const yup = require('./settings');

const updateUserSchema = yup.object().shape({
  nome: yup.string().required(),
  email: yup.string().required().email(),
  cpf: yup.string(),
  telefone: yup.string(),
  senha: yup.string(),
});

module.exports = { updateUserSchema };
