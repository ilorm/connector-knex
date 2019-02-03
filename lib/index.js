'use strict';

const connectorFactory = require('./connector/connector.class');
const schemaFactory = require('./schema/schema.factory');

const fromKnex = knex => connectorFactory({ knex });

module.exports = {
  plugins: {
    core: {
      schemaFactory,
    },
  },
  fromKnex,
};
