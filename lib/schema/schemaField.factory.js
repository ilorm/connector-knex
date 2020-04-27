'use strict';

/**
 * Class schema
 * Instantiate a knex schema
 * @param {Field} Field schemaField to extends
 * @returns {KnexSchema} The knex schema to use
 */
const injectField = (Field,) => class KnexField extends Field {

};


module.exports = injectField;
