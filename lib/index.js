'use strict';

const connectorFactory = require('./connector/connector.class');
const schemaFactory = require('./schema/schema.factory');
const baseFieldFactory = require('./fields/baseField.factory');
const booleanFieldFactory = require('./fields/boolean.factory');
const dateFieldFactory = require('./fields/date.factory');
const numberFieldFactory = require('./fields/number.factory');
const stringFieldFactory = require('./fields/string.factory');
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
      fieldFactories: {
        booleanFieldFactory,
        dateFieldFactory,
        numberFieldFactory,
        stringFieldFactory,
      },
    },
  },
  fromKnex,
};
