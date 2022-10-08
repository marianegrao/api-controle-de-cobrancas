/* eslint-disable consistent-return */
/* eslint-disable radix */
/* eslint-disable func-names */
/* eslint-disable space-unary-ops */
/* eslint-disable camelcase */
/* eslint-disable no-restricted-syntax */
const parseJSON = require('date-fns/parseJSON');
const knex = require('../connection');
const { registerChargeSchema, updateChargeSchema } = require('../validations/chargesSchemas');

const registerCharge = async (req, res) => {
  const { id: id_cliente } = req.params;
  const { data_vencimento, status } = req.body;
  const dateVencFormat = parseJSON(data_vencimento);
  const currentDate = new Date();
  const chargeOverdue = !status && dateVencFormat < currentDate;
  try {
    await registerChargeSchema.validate(req.body);

    if (data_vencimento.length < 10) {
      return res.status(400).json('Insira o ano, mês e dia neste formato xxxx-xx-xx.');
    }

    const findClient = await knex('clientes').where({ id: id_cliente }).first();

    if (!findClient) {
      return res.status(404).json('Cliente não encontrado');
    }

    if (chargeOverdue) {
      const updateClientStatus = await knex('clientes').update({ status: false }).where({ id: id_cliente });
      if (!updateClientStatus) {
        return res.status(400).json('Cliente não foi atualizado');
      }
    }

    const chargeData = {
      ...req.body,
      nome: findClient.nome,
      id_cliente,
    };

    const chargeRegistered = await knex('cobrancas').insert(chargeData);
    if (!chargeRegistered) {
      return res.status(400).json('Cobrança não foi cadastrada');
    }

    return res.status(201).json('Cobrança cadastrada com sucesso.');
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const detailCharge = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const findChargeId = await knex('cobrancas').where({ id }).first();

    if (!findChargeId) {
      return res.status(404).json('Id de cobrança não encontrado');
    }

    return res.status(200).json(findChargeId);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const updateCharge = async (req, res) => {
  const id = parseInt(req.params.id);
  const { data_vencimento, status } = req.body;
  const dateVencFormat = parseJSON(data_vencimento);
  const currentDate = new Date();
  const chargeOverdue = !status && dateVencFormat < currentDate;
  try {
    await updateChargeSchema.validate(req.body);

    if (req.body.data_vencimento.length < 10) {
      return res.status(400).json('Insira o ano, mês e dia neste formato xxxx-xx-xx.');
    }

    const findChargeId = await knex('cobrancas').where({ id }).first();

    if (!findChargeId) {
      return res.status(404).json('Id de cobrança não encontrado');
    }

    const chargeData = {
      ...findChargeId,
      ...req.body,
    };

    const chargeUpdate = await knex('cobrancas').update(chargeData).where({ id });

    if (!chargeUpdate) {
      return res.status(400).json('Cobrança não foi atualizada');
    }

    if (chargeOverdue) {
      const updateClientStatus = await knex('clientes').update({ status: false }).where({ id: findChargeId.id_cliente });
      if (!updateClientStatus) {
        return res.status(400).json('Cliente não foi atualizado');
      }
    }

    return res.status(201).json('Cobrança atualizada com sucesso.');
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const showCharges = async (req, res) => {
  const { charges } = req.query;
  const currentDate = new Date();
  try {
    if (charges === 'paid') {
      const paid = await knex('cobrancas').select('*').where('status', true);
      return res.status(200).json(paid);
    }

    if (charges === 'overdue') {
      const overdue = await knex('cobrancas').select('*').where('status', false)
        .andWhere(function () {
          this.where('data_vencimento', '<', currentDate);
        });
      return res.status(200).json(overdue);
    }

    if (charges === 'peding') {
      const peding = await knex('cobrancas').select('*').where('status', false)
        .andWhere(function () {
          this.where('data_vencimento', '>', currentDate);
        });
      return res.status(200).json(peding);
    }

    const allCharges = await knex('cobrancas').select('*');
    return res.status(200).json(allCharges);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteCharge = async (req, res) => {
  const id = parseInt(req.params.id);
  const date = new Date();

  try {
    const findChargeId = await knex('cobrancas').where({ id }).first();

    if (!findChargeId) {
      return res.status(404).json('Id de cobrança não encontrado');
    }

    if (findChargeId.status === true) {
      return res.status(400).json('Cobranças com status pago não podem ser apagadas');
    }

    const dueDate = findChargeId.data_vencimento;
    if (dueDate < date) {
      return res.status(400).json('Não é possível excluir cobranças com a data de vencimento anterior a data atual');
    }

    const chargeDeleted = await knex('cobrancas').del().where({ id });

    if (!chargeDeleted) {
      return res.status(400).json('Cobrança não foi excluida.');
    }

    return res.status(200).json('Cobrança excluido com sucesso');
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const showChargesOfClient = async (req, res) => {
  const { id: id_cliente } = req.params;
  try {
    const charges = await knex('cobrancas').select('*').where({ id_cliente });
    return res.status(200).json(charges);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const statusCharges = async (req, res) => {
  const currentDate = new Date();
  try {
    const paid = await knex('cobrancas').select('nome', 'id', 'valor').where('status', true)
      .orderBy('id', 'desc');
    let amountPaid = 0;
    for (const charge of paid) {
      amountPaid += charge.valor;
    }

    const overdue = await knex('cobrancas').select('nome', 'id', 'valor').where('status', false)
      .andWhere(function () {
        this.where('data_vencimento', '<', currentDate);
      })
      .orderBy('id', 'desc');

    let amountOverdue = 0;
    for (const charge of overdue) {
      amountOverdue += charge.valor;
    }

    const peding = await knex('cobrancas').select('nome', 'id', 'valor').where('status', false)
      .andWhere(function () {
        this.where('data_vencimento', '>', currentDate);
      })
      .orderBy('id', 'desc');

    let amountPeding = 0;
    for (const charge of peding) {
      amountPeding += charge.valor;
    }

    const allCharges = {
      paid: {
        amout: amountPaid,
        count: paid.length,
        charges: paid,
      },
      overdue: {
        amout: amountOverdue,
        count: overdue.length,
        charges: overdue,
      },
      peding: {
        amout: amountPeding,
        count: peding.length,
        charges: peding,
      },
    };

    return res.status(200).json(allCharges);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  registerCharge,
  detailCharge,
  updateCharge,
  showCharges,
  deleteCharge,
  showChargesOfClient,
  statusCharges,
};
