'use strict';

const {
  PRIMARY,
} = require('./symbols',);

/**
 * Class schema
 * Instantiate a knex schema
 * @param {SchemaField} SchemaField schemaField to extends
 * @returns {KnexSchema} The knex schema to use
 */
const injectSchemaField = (SchemaField,) => class KnexSchemaField extends SchemaField {
  /**
   * Declare this field as primary for query
   * @returns {KnexSchemaField} Return current field
   */
  primary() {
    this[PRIMARY] = true;

    return this;
  }
};


module.exports = injectSchemaField;
