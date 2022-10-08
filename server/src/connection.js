const knex = require('knex')({
  client: 'pg',
  connection: {
    host: 'ec2-44-205-63-142.compute-1.amazonaws.com',
    user: 'wuemjdhmtbxkrw',
    password: 'ea585c43e9f528f59d2217c369d10978a08e7dd5e64eb0722e7be74976edf9f8',
    database: 'd50baskju91aog',
    port: 5432,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

module.exports = knex;
