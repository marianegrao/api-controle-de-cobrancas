const express = require('express');

const routes = express();
const signIn = require('./controllers/signIn');
const verifyLogin = require('./middleware/verifyLogin');
const clients = require('./controllers/clients');
const users = require('./controllers/users');
const charges = require('./controllers/charges');
const signUp = require('./controllers/signUp');

routes.post('/signin', signIn);
routes.post('/signup', signUp);

routes.use(verifyLogin);
routes.get('/users', users.detailUser);
routes.patch('/users', users.updateUser);

routes.post('/clients', clients.registerClient);
routes.get('/clients/:id', clients.detailClient);
routes.patch('/clients/:id', clients.updateClient);
routes.get('/clients', clients.showAllClients);
routes.get('/clients-status', clients.statusClients);
routes.delete('/clients/:id', clients.deleteClient);

routes.post('/clients/:id/charges', charges.registerCharge);
routes.get('/clients/:id/charges', charges.showChargesOfClient);
routes.get('/charges/:id', charges.detailCharge);
routes.get('/charges-status', charges.statusCharges);
routes.patch('/charges/:id', charges.updateCharge);
routes.get('/charges', charges.showCharges);
routes.delete('/charges/:id', charges.deleteCharge);

module.exports = routes;
