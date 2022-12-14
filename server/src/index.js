require('dotenv').config();
const express = require('express');

const app = express();
const cors = require('cors');
const routes = require('./routes');

app.use(express.json());
app.use(cors());
app.use(routes);
app.listen(process.env.PORT || 3001);
