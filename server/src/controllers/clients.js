const knex = require('../connection');
const registerOrUpdateSchema = require('../validations/clientsSchemas');

const registerClient = async (req, res) => {
  const { id: id_usuario } = req.user;
  const { email, cpf } = req.body;
  try {
    await registerOrUpdateSchema.validate(req.body);

    const findClient = await knex('clientes').where({ email }).first();
    if (findClient) {
      return res.status(400).json('E-mail já cadastrado');
    }

    const findCpf = await knex('clientes').where({ cpf }).first();
    if (findCpf) {
      return res.status(400).json('CPF já cadastrado');
    }

    const clientData = {
      ...req.body,
      id_usuario,
    };

    const clientRegistered = await knex('clientes').insert(clientData);

    if (!clientRegistered) {
      return res.status(400).json('O cliente não foi cadastrado');
    }

    return res.status(201).json('O cliente foi cadastrado com sucesso.');
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const detailClient = async (req, res) => {
  const { id } = req.params;

  try {
    const clientFound = await knex('clientes').where({ id }).first();
    if (!clientFound) {
      return res.status(404).json('Cliente não encontrado');
    }

    return res.status(200).json(clientFound);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateClient = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    await registerOrUpdateSchema.validate(req.body);

    const clientFound = await knex('clientes').where({ id }).first();

    if (!clientFound) {
      return res.status(404).json('Cliente não encontrado');
    }

    if (email !== clientFound.email) {
      const emailInUse = await knex('clientes').where({ email }).first();
      if (emailInUse) {
        return res.status(400).json('Já existe um cliente registrado com o email informado');
      }
    }

    const clientUpdated = await knex('clientes').update(req.body).where({ id });

    if (!clientUpdated) {
      return res.status(400).json('O Cliente não foi atualizado');
    }

    return res.status(200).json('Cliente foi atualizado com sucesso.');
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const showAllClients = async (req, res) => {
  const { clients } = req.query;
  try {
    if (clients === 'nonDefaulters') {
      const nonDefaulters = await knex('clientes').select('*').where('status', true);
      return res.status(200).json(nonDefaulters);
    }

    if (clients === 'defaulters') {
      const defaulters = await knex('clientes').select('*').where('status', false);
      return res.status(200).json(defaulters);
    }

    const allClients = await knex('clientes').select('*');
    return res.status(200).json(allClients);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteClient = async (req, res) => {
  const { id } = req.params;
  try {
    const clientFound = await knex('clientes').where({ id }).first();
    if (!clientFound) {
      return res.status(404).json('Cliente não encontrado');
    }

    const clientDeleted = await knex('clientes').del().where({ id });
    if (!clientDeleted) {
      return res.status(400).json('Cliente não foi excluido');
    }

    return res.status(200).json('Cliente excluido com sucesso');
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const statusClients = async (req, res) => {
  try {
    const nonDefaulters = await knex('clientes').select('nome', 'id', 'cpf').where('status', true).limit(4);
    const defaulters = await knex('clientes').select('nome', 'id', 'cpf').where('status', false).limit(4);

    const clients = {
      nonDefaulters: {
        clients: nonDefaulters,
        count: nonDefaulters.length,
      },
      defaulters: {
        clients: defaulters,
        count: defaulters.length,
      },
    };

    return res.status(200).json(clients);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  registerClient,
  detailClient,
  updateClient,
  showAllClients,
  statusClients,
  deleteClient,
};
