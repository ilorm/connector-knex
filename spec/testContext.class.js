const Fixtures = require('./starWars.fixture');
const TestContext = require('ilorm/spec/common/testContext.class');

// Create a clean instance of ilorm :
const knex = require('./knex');
const ilormKnex = require('../index');

/**
 * Class used to store a test session data (database connection, ilorm instance).
 */
class KnexTestContext extends TestContext {
  // eslint-disable-next-line require-jsdoc
  constructor() {
    super();

    this.knex = knex();

    const KnexConnection = ilormKnex.fromKnex(this.knex);

    this.ilorm.use(ilormKnex);

    this.fixtures = new Fixtures(this.knex, KnexConnection);
  }

  // eslint-disable-next-line require-jsdoc
  finalCleanUp() {
    return this.knex.destroy();
  }
}


module.exports = KnexTestContext;
