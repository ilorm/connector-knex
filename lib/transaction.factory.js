/**
 * Inject ilorm Transaction
 * @param {Transaction} Transaction The transaction object to extends
 * @returns {KnexTransaction} Return the transaction knex
 */
function transactionFactory(Transaction) {
  return class KnexTransaction extends Transaction {
    /**
     * Constructor, prepare knex for transaction;
     */
    constructor() {
      super();

      const self = this;

      this.haveKnexTransactionBound = false;

      this.knexTransactionAsync = new Promise((resolve) => {
        self.resolveAsyncKnexTransaction = resolve;
      });
    }

    /**
     * Model the transaction run on
     * @param {Model} Model The model
     * @returns {void} Return nothing
     */
    bindModel({ Model, }) {
      if (this.haveKnexTransactionBound) {
        return;
      }

      this.haveKnexTransactionBound = true;

      Model.getConnector()
        .getKnexTransaction()
        .then((result) => this.resolveAsyncKnexTransaction(result));
    }

    /**
     * Get the KnexTransaction associate with the given transaction
     * @returns {Promise<KnexTransaction>} KnexTransaction object to bind with query
     */
    getKnexTransaction() {
      return this.knexTransactionAsync;
    }

    /**
     * Commit the transaction, applying the result into the database
     * @returns {Promise} Resolve when is finished
     */
    async commit() {
      const knexTransaction = await this.knexTransactionAsync;

      return knexTransaction.commit();
    }

    /**
     * Rollback the transaction.
     * @returns {Promise} Resolve when is finished
     */
    async rollback() {
      const knexTransaction = await this.knexTransactionAsync;

      return knexTransaction.rollback();
    }
  };
}

module.exports = transactionFactory;
