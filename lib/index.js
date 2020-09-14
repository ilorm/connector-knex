'use strict';

const connectorFactory = require('./connector/connector.class');
const schemaFactory = require('./schema/schema.factory');
const baseFieldFactory = require('./fields/baseField.factory');
const transactionFactory = require('./transaction.factory');

/**
 * Factory for creating the connector
 * @param {Knex} knex Knex connection
 * @returns {KnexConnector} KnexConnector to use with ilorm
 */
const fromKnex = (knex) => connectorFactory({ knex, });

module.exports = {
  plugins: {
    core: {
      schemaFactory,
      transactionFactory,
      baseFieldFactory,
    },
  },
  fromKnex,
};
