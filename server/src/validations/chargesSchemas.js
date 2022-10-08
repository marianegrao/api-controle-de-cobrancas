const yup = require('yup');

const registerChargeSchema = yup.object().shape({
  valor: yup.string().required(),
  descricao: yup.string().required(),
  data_vencimento: yup.date().required(),
  status: yup.boolean().required(),
});

const updateChargeSchema = yup.object().shape({
  descricao: yup.string().required(),
  status: yup.boolean().required(),
  data_vencimento: yup.date().required(),
  valor: yup.string().required(),
});

module.exports = {
  registerChargeSchema,
  updateChargeSchema,
};
