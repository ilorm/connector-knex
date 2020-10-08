const InvoiceFixtures = require('ilorm/spec/common/invoices.fixtures');
const { v4: uuidv4, } = require('uuid');

// eslint-disable-next-line require-jsdoc
class KnexInvoicesFixtures extends InvoiceFixtures {
  // eslint-disable-next-line require-jsdoc
  constructor(knex, IlormKnex) {
    super({
      idGenerator: uuidv4,
    });

    this.knex = knex;
    this.IlormKnex = IlormKnex;
  }

  // eslint-disable-next-line require-jsdoc
  getInvoicesConnector() {
    return new this.IlormKnex({
      sourceName: 'invoices',
    });
  }

  // eslint-disable-next-line require-jsdoc
  getCustomersConnector() {
    return new this.IlormKnex({
      sourceName: 'customers',
    });
  }

  // eslint-disable-next-line require-jsdoc
  getAccountsConnector() {
    return new this.IlormKnex({
      sourceName: 'accounts',
    });
  }

  // eslint-disable-next-line require-jsdoc
  async initDb() {
    await this.knex.schema.createTable('customers', (table) => {
      table.uuid('id');
      table.string('firstName');
      table.string('lastName');
    });
    await this.knex.schema.createTable('invoices', (table) => {
      table.uuid('id');
      table.uuid('customerId');
      table.integer('amount');
      table.boolean('isPaid');
      table.dateTime('createdAt');
      table.dateTime('paidAt');
    });
    await this.knex.schema.createTable('accounts', (table) => {
      table.uuid('customerId');
      table.integer('balance');
    });

    const Invoices = this.getInvoicesFixture();
    const Customers = this.getCustomersFixture();
    const Accounts = this.getAccountsFixture();

    await this.knex.insert(Object.keys(Customers).map((CustomerName) => Customers[CustomerName]))
      .into('customers');
    await this.knex.insert(Object.keys(Invoices).map((charName) => Invoices[charName]))
      .into('invoices');
    await this.knex.insert(Object.keys(Accounts).map((accountName) => Accounts[accountName]))
      .into('accounts');

  }

  // eslint-disable-next-line require-jsdoc
  async cleanDb() {
    try {
      await this.knex.schema.dropTable('customers');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    try {
      await this.knex.schema.dropTable('invoices');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    try {
      await this.knex.schema.dropTable('accounts');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }
}

module.exports = KnexInvoicesFixtures;

