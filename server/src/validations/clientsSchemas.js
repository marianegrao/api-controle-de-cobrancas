const yup = require('./settings');

const registerOrUpdateSchema = yup.object().shape({
  nome: yup.string().required(),
  email: yup.string().required().email(),
  cpf: yup.string().required(),
  telefone: yup.string().required(),
  logradouro: yup.string(),
  complemento: yup.string(),
  cidade: yup.string(),
  estado: yup.string(),
  status: yup.boolean(),
  cep: yup.string(),
  bairro: yup.string(),
});

module.exports = registerOrUpdateSchema;
