/**
 * Create a CollectionManager
 * @param {knex} knex The knex instance bound with the Connector
 * @returns {CollectionManager} The CollectionManager to use
 */
function injectDependencies({ knex, }) {
  /**
   * Class for editing knex table
   */
  return class CollectionManager {
    /**
     * Create a new table
     * @param {String} name The name of the new table
     * @param {Schema} schema The ilorm Schema to use as a definition
     * @returns {Promise} Resolve when table is created
     */
    static create({ name, schema, }) {
      return knex.schema.createTable(name, (table) => {
        for (const columnName of Object.keys(schema)) {
          schema[columnName].applyKnexDefinitionOnTable(table, columnName);
        }

      });
    }

    /**
     * Delete a table
     * @param {String} name The table name to delete
     * @returns {Promise} Resolve when delete is applied
     */
    static delete({ name, }) {
      return knex.schema.dropTable(name);
    }

    /**
     * Rename columnName to newName
     * @param {String} name The table target
     * @param {Array.<{oldName, newName}>} toRename Array of column to rename
     * @returns {Promise} Resolve when renamed is applied
     */
    static renameFields({ name, toRename, }) {
      return knex.schema.table(name, (table) => {
        toRename.forEach(({ newName, oldName, }) => {
          table.renameColumn(oldName, newName);
        });
      });
    }

    /**
     * Alter column of table name
     * @param {String} name Name of targeted table
     * @param {Schema} schema The new schema to apply
     * @return {*|Promise<void>|void} Resolve when alter is finished
     */
    static alter({ name, schema, }) {
      return knex.schema.table(name, (table) => {
        for (const columnName of Object.keys(schema)) {
          schema[columnName].applyKnexDefinitionOnTable(table, columnName);
        }
      });
    }

    /**
     * Drop fields from table name
     * @param {String} name The target table
     * @param {String[]} fieldsToDrop The column to drop
     * @return {*|Promise<void>|void} Resolve when columns are dropped
     */
    static deleteFields({ name, fieldsToDrop, }) {
      return knex.schema.table(name, (table) => {
        table.dropColumns(fieldsToDrop);
      });
    }

    /**
     * Check if a table exists
     * @param {String} name The table name to check existing
     * @returns {Boolean} Return true if the table exists, false otherwise.
     */
    static isExists({ name, }) {
      return new Promise((resolve) => {
        knex.schema.hasTable(name)
          .then((exists) => {
            resolve(exists);
          });
      });
    }
  };
}

module.exports = injectDependencies;
