const bcrypt = require('bcrypt');
const knex = require('../connection');
const schemaSignUp = require('../validations/signUpSchema');

const signUp = async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    await schemaSignUp.validate(req.body);
    const emailFound = await knex('usuarios').where({ email }).first();
    if (emailFound) {
      return res.status(400).json('Email já existente');
    }

    const passwordEncrypted = await bcrypt.hash(senha, 10);
    const userData = {
      nome, email, senha: passwordEncrypted,
    };
    const userRegistered = await knex('usuarios').insert(userData);

    if (!userRegistered) {
      return res.status(400).json('Usuário não foi cadastrado.');
    }

    return res.status(200).json('Usuário cadastrado com sucesso!');
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = signUp;
