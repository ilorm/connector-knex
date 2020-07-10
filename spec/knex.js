const fs = require('fs');
const knex = require('knex');

// eslint-disable-next-line no-process-env
const confFile = `./config/${process.env.NODE_ENV}.json`;

// eslint-disable-next-line no-sync
const confPath = fs.existsSync(`./spec/${confFile}`) ? confFile : './config/default.json';

const conf = require(confPath);

module.exports = () => knex({
  client: 'mysql2',
  connection: conf.connection,
});
