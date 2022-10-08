const bcrypt = require('bcrypt');
const knex = require('../connection');
const { updateUserSchema } = require('../validations/usersSchemas');

const detailUser = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateUser = async (req, res) => {
  const { email, senha } = req.body;
  const { id } = req.user;
  let userData = {
    ...req.body,
  };
  try {
    await updateUserSchema.validate(req.body);
    if (email !== req.user.email) {
      const emailFound = await knex('usuarios').where({ email }).first();

      if (emailFound) {
        return res.status(400).json('Email já existente');
      }
    }

    if (senha) {
      const newPassword = await bcrypt.hash(senha, 10);
      userData = {
        ...userData,
        senha: newPassword,
      };
    } else {
      const user = await knex('usuarios').where({ id }).first();
      userData = {
        ...userData,
        senha: user.find,
      };
    }

    const userUpdated = await knex('usuarios').update(userData).where({ id });

    if (!userUpdated) {
      return res.status(400).json('Usuário não foi atualizado');
    }

    return res.status(200).json('Usuário atualizado com sucesso.');
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  detailUser,
  updateUser,
};
