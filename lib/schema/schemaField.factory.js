'use strict';

/**
 * Class schema
 * Instantiate a knex schema
 * @param {SchemaField} SchemaField schemaField to extends
 * @returns {KnexSchema} The knex schema to use
 */
const injectSchemaField = (SchemaField,) => class KnexSchemaField extends SchemaField {

};


module.exports = injectSchemaField;
