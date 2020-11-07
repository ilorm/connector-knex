const StarWarsFixtures = require('./starWars.fixture');
const InvoicesFixtures = require('./invoices.fixtures');
const TestContext = require('ilorm/spec/common/testContext.class');

// Create a clean instance of ilorm :
const knex = require('./knex');
const ilormKnex = require('../index');

/**
 * Class used to store a test session data (database connection, ilorm instance).
 */
class KnexTestContext extends TestContext {
  // eslint-disable-next-line require-jsdoc
  constructor(Fixtures) {
    super();

    this.knex = knex();

    const KnexConnection = ilormKnex.fromKnex(this.knex);

    this.ilorm.use(ilormKnex);

    this.Connector = KnexConnection;

    if (Fixtures) {
      this.fixtures = new Fixtures(this.knex, KnexConnection);
    }
  }

  // eslint-disable-next-line require-jsdoc
  static getStarWars() {
    return new this(StarWarsFixtures);
  }

  // eslint-disable-next-line require-jsdoc
  static getInvoices() {
    return new this(InvoicesFixtures);
  }

  // eslint-disable-next-line require-jsdoc
  async deleteSource(sourceName) {
    try {
      await this.knex.schema.dropTable(sourceName);
      // eslint-disable-next-line no-empty
    } catch (err) {
    }
  }

  // eslint-disable-next-line require-jsdoc
  finalCleanUp() {
    return this.knex.destroy();
  }
}


module.exports = KnexTestContext;
