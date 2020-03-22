const {
  PRIMARY,
} = require('../schema/symbols',);

/**
 * Create a new Mongo Model class.
 * @param {Model} ParentModel The Model used as Parent
 * @returns {KnexModel} The KnexModel created
 */
const mongoModelFactory = ({ ParentModel, },) => (
  class KnexModel extends ParentModel {
    /**
     * Return a query targeting the current instance
     * @returns {Query} The query targeting the current instance
     */
    getQueryPrimary() {
      const query = this.constructor.query();

      const primaryKeys = this.constructor.getSchema()[PRIMARY];

      if (!primaryKeys.length) {
        throw new Error('Can not use save method if no primary key declared in the schema',);
      }

      for (const field of primaryKeys) {
        query[field].is(this[field],);
      }

      return query;
    }
  }
);

module.exports = mongoModelFactory;
