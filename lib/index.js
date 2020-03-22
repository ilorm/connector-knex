'use strict';

const connectorFactory = require('./connector/connector.class',);
const schemaFactory = require('./schema/schema.factory',);
const schemaFieldFactory = require('./schema/schemaField.factory',);

/**
 * Factory for creating the connector
 * @param {Knex} knex Knex connection
 * @returns {KnexConnector} KnexConnector to use with ilorm
 */
const fromKnex = (knex,) => connectorFactory({ knex, },);

module.exports = {
  plugins: {
    core: {
      schemaFactory,
      schemaFieldFactory,
    },
  },
  fromKnex,
};
