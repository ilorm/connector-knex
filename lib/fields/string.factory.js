'use strict';

/**
 * Class KnexStringField
 * @param {Field} Field schemaField to extends
 * @returns {KnexStringField} The knex string field to use
 */
const injectField = ({ Field, }) => class KnexStringField extends Field {
  /**
   * Internal method used by collectionManager to create / alter table
   * Apply knex definition of the column onto the specific parameter table
   * @param {table} table Table knex object to apply on
   * @param {String} columnName The name to use for the column
   * @returns {void} Return nothing
   */
  applyKnexDefinitionOnTable(table, columnName) {
    table.string(columnName);
  }
};


module.exports = injectField;
