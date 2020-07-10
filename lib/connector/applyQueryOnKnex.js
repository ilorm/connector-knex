'use strict';

const { OPERATIONS, SORT_BEHAVIOR, } = require('ilorm/lib/constants').QUERY;
const { NAME, } = require('ilorm/lib/constants').FIELD;

const operatorConversion = {
  [OPERATIONS.IS]: '=',
  [OPERATIONS.IS_NOT]: '<>',
  [OPERATIONS.IS_IN]: 'in',
  [OPERATIONS.IS_NOT_IN]: 'not in',
  [OPERATIONS.GREATER_THAN]: '>',
  [OPERATIONS.LOWER_THAN]: '<',
  [OPERATIONS.GREATER_OR_EQUAL_THAN]: '>=',
  [OPERATIONS.LOWER_OR_EQUAL_THAN]: '<=',
};

const ASCENDING = 'ASC';
const DESCENDING = 'DESC';

/**
 * Convert a valid inputQuery to a query
 * @param {Query} query The ilorm query you want to convert
 * @param {Object} knex To apply query
 * @returns {Object} Return knex parameter to chain call
 */
function applyQueryOnKnex(query, knex) {
  const selectFields = [];

  query.queryBuilder({
    onOptions: ({ skip, limit, }) => {
      if (limit) {
        knex.limit(limit);
      }
      if (skip) {
        knex.offset(skip);
      }
    },
    onOr: (arrayOfQuery) => {
      knex.where((branch) => {
        arrayOfQuery.forEach((query) => {
          branch.orWhere(function orClause() {
            applyQueryOnKnex(query, this); // eslint-disable-line
          });
        });
      });
    },
    onSelect: ({ field, }) => {
      selectFields.push(field);
    },
    onSort: ({ field, behavior, }) => {
      knex.orderBy(field[NAME], behavior === SORT_BEHAVIOR.ASCENDING ? ASCENDING : DESCENDING);
    },
    onOperator: ({ field, operator, value, }) => {
      if (operator === OPERATIONS.BETWEEN) {
        knex.where(field[NAME], '>', value.min);
        knex.where(field[NAME], '<', value.max);

        return;
      }
      knex.where(field[NAME], operatorConversion[operator], value);
    },
  });

  if (selectFields.length > 0) {
    knex.select(...selectFields.map((field) => field[NAME]));
  }

  return knex;
}

module.exports = applyQueryOnKnex;
