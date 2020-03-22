'use strict';

const {
  PRIMARY,
} = require('../schema/symbols',);

/**
 * Class schema
 * Instantiate a knex schema
 * @param {Schema} Schema schema to extends
 * @returns {KnexSchema} The knex schema to use
 */
const injectSchema = (Schema,) => class KnexSchema extends Schema {
  /**
   * Create the schema
   * @param {Object} schema Schema definition to build
   */
  constructor(schema,) {
    super(schema,);

    this[PRIMARY] = [];

    for (const key of Object.keys(schema,)) {
      if (schema[key][PRIMARY]) {
        this[PRIMARY].push(key,);
      }
    }

  }
};


module.exports = injectSchema;
