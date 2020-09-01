const fs = require('fs');
const knex = require('knex');

// eslint-disable-next-line no-process-env
const confFile = `${process.cwd()}/spec/config/${process.env.NODE_ENV}.js`;

// eslint-disable-next-line no-sync
const confPath = fs.existsSync(confFile) ? confFile : `${process.cwd()}/spec/config/default.js`;

const conf = require(confPath);

module.exports = () => knex({
  client: 'mysql2',
  connection: conf.connection,
});
