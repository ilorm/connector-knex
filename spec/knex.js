const fs = require('fs');
const knex = require('knex');

// eslint-disable-next-line no-process-env
const confFile = `${__dirname}/config/${process.env.NODE_ENV}.js`;

// eslint-disable-next-line no-sync
const confPath = fs.existsSync(confFile) ? confFile : `${__dirname}/config/default.js`;


const conf = require(confPath);

module.exports = () => knex({
  client: 'mysql2',
  connection: conf.connection,
});
