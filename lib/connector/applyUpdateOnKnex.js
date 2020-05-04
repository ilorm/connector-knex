'use strict';

const { OPERATIONS, } = require('ilorm/lib/constants').QUERY;


/**
 * Convert a valid update ilorm query to an update mongo query.
 * @param {Query} query The ilorm query you want to convert
 * @param {Object} knex To apply query
 * @returns {Object} Return knex parameter to chain call
 */
function applyUpdateOnKnex(query, knex,) {
  query.updateBuilder({
    onOperator: ({ field, operator, value, },) => {
      if (operator === OPERATIONS.SET) {
        knex.update(field, value,);
      } else {
        knex.increment(field, value,);
      }
    },
  },);

  return knex;
}

module.exports = applyUpdateOnKnex;
