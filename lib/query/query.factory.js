/**
 * Inject dependencies to query
 * @param {Query} ParentQuery class Query to overload
 * @returns {KnexQuery} The query returned by a mongo model
 */
const injectDependencies = ({ ParentQuery, }) => {

  /**
   * The query overload Query object
   */
  class KnexQuery extends ParentQuery {}

  return KnexQuery;
};

module.exports = injectDependencies;
