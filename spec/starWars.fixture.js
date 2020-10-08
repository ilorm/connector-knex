const StarWarsFixtures = require('ilorm/spec/common/starWars.fixtures');
const { v4: uuidv4, } = require('uuid');

// eslint-disable-next-line require-jsdoc
class KnexStarWarsFixtures extends StarWarsFixtures {
  // eslint-disable-next-line require-jsdoc
  constructor(knex, IlormKnex) {
    super({
      idGenerator: uuidv4,
    });

    this.knex = knex;
    this.IlormKnex = IlormKnex;
  }

  // eslint-disable-next-line require-jsdoc
  getCharactersConnector() {
    return new this.IlormKnex({
      sourceName: 'characters',
    });
  }

  // eslint-disable-next-line require-jsdoc
  getRacesConnector() {
    return new this.IlormKnex({
      sourceName: 'races',
    });
  }

  // eslint-disable-next-line require-jsdoc
  async initDb() {
    await this.knex.schema.createTable('race', (table) => {
      table.uuid('id');
      table.string('name');
    });
    await this.knex.schema.createTable('characters', (table) => {
      table.uuid('id');
      table.string('name');
      table.uuid('raceId');
      table.integer('height');
      table.enu('gender', [ 'M', 'F', ]);
    });

    const characters = this.getCharactersFixture();
    const races = this.getRacesFixture();

    await this.knex.insert(Object.keys(races).map((raceName) => races[raceName]))
      .into('race');
    await this.knex.insert(Object.keys(characters).map((charName) => characters[charName]))
      .into('characters');

  }

  // eslint-disable-next-line require-jsdoc
  async cleanDb() {
    try {
      await this.knex.schema.dropTable('race');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    try {
      await this.knex.schema.dropTable('characters');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }
}

module.exports = KnexStarWarsFixtures;

