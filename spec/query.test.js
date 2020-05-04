const { expect, } = require('chai');
const fixtures = require('./starWars.fixture');

// Create a clean instance of ilorm :
const Ilorm = require('ilorm').constructor;
const ilormKnex = require('..');
const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'test',
    multipleStatements: true,
  },
});

const KnexConnection = ilormKnex.fromKnex(knex);

const ilorm = new Ilorm();

ilorm.use(ilormKnex);
const { Schema, newModel, } = ilorm;

// Declare schema :
const charSchema = fixtures.charactersSchema(Schema);

const modelConfig = {
  name: 'characters',
  schema: charSchema,
  connector: new KnexConnection({ tableName: 'characters', }),
};

const Characters = newModel(modelConfig);

describe('spec ilorm knex', () => {
  describe('Should query data from database', () => {
    before(() => fixtures.initDb(knex));

    after(() => fixtures.cleanDb(knex));

    it('Should query data, based on criteria', async () => {
      const results = await Characters.query()
        .gender.is('M')
        .name.selectOnly()
        .find();

      expect(results).to.be.deep.equal([
        'Darth Vador',
        'Luck Skywalker',
        'Chewbacca',
      ]);
    });

    it('Should count data, based on criteria', async () => {
      const results = await Characters.query()
        .height.between({
          min: 200,
          max: 300,
        })
        .count();

      const EXPECTED_COUNT = 2;

      expect(results).to.be.deep.equal(EXPECTED_COUNT);
    });

    it('Should retrieve on instance, based on criteria', async () => {
    });
  });
});
