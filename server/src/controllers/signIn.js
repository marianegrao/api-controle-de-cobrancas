const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('../connection');
const schemaSignIn = require('../validations/signInSchema');
const hash = require('../secret/hash');

const signIn = async (req, res) => {
  const { email, senha } = req.body;
  try {
    await schemaSignIn.validate(req.body);
    const userFound = await knex('usuarios').where('email', email).first();

    if (!userFound) {
      return res.status(400).json('O usuario não foi encontrado');
    }

    const user = userFound;

    const passwordEncrypted = await bcrypt.compare(senha, user.senha);

    if (!passwordEncrypted) {
      return res.status(400).json('Email e/ou senha não conferem');
    }

    const token = jwt.sign({ id: user.id }, hash, { expiresIn: '8h' });

    const { senha: userPassword, ...dataUser } = user;

    return res.status(200).json({
      user: dataUser,
      token,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = signIn;
