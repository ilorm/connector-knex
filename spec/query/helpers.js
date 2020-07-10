const fixtures = require('../starWars.fixture');

// Create a clean instance of ilorm :
const Ilorm = require('ilorm').constructor;
const knex = require('../knex');
const ilormKnex = require('../..');

/**
 * Class used to store a test session data (database connection, ilorm instance).
 */
class TestContext {
  // eslint-disable-next-line require-jsdoc
  constructor() {
    this.ilorm = new Ilorm();
  }

  // eslint-disable-next-line require-jsdoc
  getCharactersModel() {
    return this.Model;
  }

  // eslint-disable-next-line require-jsdoc
  initModel() {
    const KnexConnection = ilormKnex.fromKnex(this.knex);

    this.ilorm.use(ilormKnex);

    // Declare schema :
    const charSchema = fixtures.charactersSchema(this.ilorm.Schema);

    const modelConfig = {
      name: 'characters',
      schema: charSchema,
      connector: new KnexConnection({ tableName: 'characters', }),
    };

    this.Model = this.ilorm.newModel(modelConfig);
  }

  // eslint-disable-next-line
  async initDb() {
    this.knex = knex();
    this.initModel();

    return fixtures.initDb(this.knex);
  }

  // eslint-disable-next-line
  async cleanDb() {
    return fixtures.cleanDb(this.knex);
  }

}


module.exports = TestContext;
