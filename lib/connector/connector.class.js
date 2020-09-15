'use strict';

const applyQueryOnKnex = require('./applyQueryOnKnex');
const applyUpdateOnKnex = require('./applyUpdateOnKnex');
const modelFactory = require('../model/model.factory');
const queryFactory = require('../query/query.factory');
const { KNEX, } = require('../query/fields');
const { QUERY, } = require('ilorm/lib/constants');

/**
 * Generate a KnexConnector by injecting the knex instance
 * @param {Object} knex knex object
 * @return {KnexConnector} The resulting Connector
 */
const injectDb = ({ knex, }) => {

  /**
   * Class representing a ilorm connector binded with knex
   */
  class KnexConnector {
    /**
     * Bind current connector with the given table
     * @param {String} tableName The table name
     */
    constructor({ tableName, }) {
      this.tableName = tableName;
    }

    /**
     * Generate a knex targeting the current table
     * @returns {Object} Knex connector
     */
    getKnex() {
      return knex(this.tableName);
    }

    /**
     * Get knex associate with the given query
     * @param {Query} query to extract knex from
     * @returns {{knexQuery: knexQuery}} Return a knex instance to apply the query on
     */
    async getKnexAssociateWithQuery(query) {
      if (query[QUERY.FIELDS.TRANSACTION]) {
        const knexTransaction = await query[QUERY.FIELDS.TRANSACTION].getKnexTransaction();

        return {
          knexQuery: knexTransaction(query[QUERY.FIELDS.CONNECTOR].tableName)
            .forUpdate(),
        };
      }

      return {
        knexQuery: query[KNEX],
      };
    }

    /**
     * Return Knex Transaction
     * @returns {KnexTransaction} Knex Transaction
     */
    getKnexTransaction() {
      return knex.transaction();
    }

    /**
     * Create one or more docs into the database.
     * @param {Object} items The object you want to create in the database
     * @param {Transaction} transaction Bind create with a transaction
     * @returns {*} The result of the operation
     */
    create({ items, transaction = null, }) {
      if (transaction) {
        const knexTrasnaction = transaction.getKnexTransaction();

        return knexTrasnaction(this.tableName).insert(items);
      }

      return this.getKnex().insert(items);
    }

    /**
     * Find one or more document into your mongoDb database.
     * @param {Query} query The ilorm query you want to run on your Database.
     * @returns {Promise} Every documents who match the query
     */
    async find(query) {
      const { knexQuery, } = await this.getKnexAssociateWithQuery(query);

      return applyQueryOnKnex(query, knexQuery);
    }

    /**
     * Find one document from your database
     * @param {Query} query The ilorm query you want to run on your Database.
     * @returns {*|Promise.<Model>|*} The document first found
     */
    async findOne(query) {
      const { knexQuery, } = await this.getKnexAssociateWithQuery(query);

      return applyQueryOnKnex(query, knexQuery)
        .limit(1)
        .then((items) => (items && items.length ? items[0] : null));
    }

    /**
     * Count the number of document who match the query
     * @param {Query} query The ilorm query you want to run on your Database.
     * @returns {Promise.<Number>} The number of document found
     */
    async count(query) {
      const { knexQuery, } = await this.getKnexAssociateWithQuery(query);

      const rawKnex = await applyQueryOnKnex(query, knexQuery)
        .count('*');

      return rawKnex[0]['count(*)'];
    }

    /**
     * Update one or more document who match query
     * @param {Query} query The ilorm query you want to run on your Database.
     * @returns {*} The number of document updated
     */
    async update(query) {
      const { knexQuery, } = await this.getKnexAssociateWithQuery(query);

      applyQueryOnKnex(query, knexQuery);

      return applyUpdateOnKnex(query, knexQuery);
    }

    /**
     * Update one document who match query
     * @param {Query} query The ilorm query you want to run on your Database.
     * @returns {*} Return true if a document was updated
     */
    async updateOne(query) {
      const { knexQuery, } = await this.getKnexAssociateWithQuery(query);

      knexQuery
        .limit(1);

      applyQueryOnKnex(query, knexQuery);

      return applyUpdateOnKnex(query, knexQuery);
    }

    /**
     * Remove one or document who match the query
     * @param {Query} query The ilorm query you want to run on your Database.
     * @returns {Promise.<Number>} The number of document removed
     */
    async remove(query) {
      const { knexQuery, } = await this.getKnexAssociateWithQuery(query);

      applyQueryOnKnex(query, knexQuery);

      return knexQuery.del();
    }

    /**
     * Remove one document who match the query
     * @param {Query} query The ilorm query you want to run on your Database.
     * @returns {Promise.<Boolean>} Return true if a document was removed
     */
    async removeOne(query) {
      const { knexQuery, } = await this.getKnexAssociateWithQuery(query);

      applyQueryOnKnex(query, knexQuery);

      // Knex does not apply .limit(1) when he run a del command (using raw, to enforce the LIMIT 1);
      const [
        { affectedRows, },
      ] = await knex.raw(`${knexQuery.del().toString()} LIMIT 1;`);

      return affectedRows;
    }

    /**
     * Create a stream object from the query
     * @param {Query} query The ilorm query you want to use to generate the stream
     * @returns {Stream} The stream associated with the query/
     */
    async stream(query) {
      const { knexQuery, } = await this.getKnexAssociateWithQuery(query);

      return applyQueryOnKnex(query, knexQuery)
        .stream();
    }

    /**
     * Create a new KnexModel from the given params
     * @param {Model} ParentModel The ilorm global Model used as parent of ModelConnector
     * @returns {KnexModel} The result KnexModel
     */
    modelFactory({ ParentModel, }) {
      return modelFactory({
        ParentModel,
      });
    }

    /**
     * Create a new KnexQuery from the given params
     * @param {Query} ParentQuery The ilorm global Query used as parent of QueryConnector
     * @returns {KnexQuery} The result KnexQuery
     */
    queryFactory({ ParentQuery, }) {
      return queryFactory({ ParentQuery, });
    }



  }

  return KnexConnector;
};

module.exports = injectDb;
