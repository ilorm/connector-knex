
const DARTH_VADOR = {
  name: 'Darth Vador',
  gender: 'M',
  height: 203,
};
const LUKE = {
  name: 'Luke Skywalker',
  gender: 'M',
  height: 172,
};
const CHEWBACCA = {
  name: 'Chewbacca',
  gender: 'M',
  height: 230,
};
const LEIA = {
  name: 'Leia Organa',
  gender: 'F',
  height: 150,
};

// eslint-disable-next-line require-jsdoc
const initDb = async (knex) => {
  await knex.schema.createTable('race', (table) => {
    table.uuid('id');
    table.string('name');
  });
  await knex.schema.createTable('characters', (table) => {
    table.uuid('id');
    table.string('name');
    table.uuid('raceId');
    table.integer('height');
    table.enu('gender', [ 'M', 'F', ]);
  });

  await knex.insert([
    {
      id: 'd4f9e1f5-555a-4d3a-9cb0-2a16f22ff50b',
      name: 'human',
    },
    {
      id: '08fb0d7c-499b-40fe-9074-5edc1b091e0a',
      name: 'wookie',
    },
  ]).into('race');

  await knex.insert([
    {
      id: '8eb82c15-4f26-4945-b568-83905b610ba9',
      raceId: 'd4f9e1f5-555a-4d3a-9cb0-2a16f22ff50b',
      ...DARTH_VADOR,
    },
    {
      id: '034d29fc-9dd2-417c-9c5e-8b17011ee0e1',
      raceId: 'd4f9e1f5-555a-4d3a-9cb0-2a16f22ff50b',
      ...LUKE,
    },
    {
      id: '28adf8e6-7508-40ea-977a-55e08302a352',
      raceId: '08fb0d7c-499b-40fe-9074-5edc1b091e0a',
      ...CHEWBACCA,
    },
    {
      id: '73eb1c35-a7ca-4ad9-bcd7-a6f037f58471',
      raceId: 'd4f9e1f5-555a-4d3a-9cb0-2a16f22ff50b',
      ...LEIA,
    },
  ]).into('characters');

};

// eslint-disable-next-line require-jsdoc
const cleanDb = async (knex) => {
  await knex.schema.dropTable('race');
  await knex.schema.dropTable('characters');

  await knex.destroy();
};

// eslint-disable-next-line require-jsdoc
const raceSchema = (Schema) => new Schema({
  id: Schema.string(),
  name: Schema.string(),
});

// eslint-disable-next-line require-jsdoc
const charactersSchema = (Schema) => new Schema({
  id: Schema.string(),
  name: Schema.string(),
  raceId: Schema.string(),
  height: Schema.number(),
  gender: Schema.string(),
});

module.exports = {
  initDb,
  cleanDb,
  raceSchema,
  charactersSchema,
  LUKE,
  CHEWBACCA,
  DARTH_VADOR,
  LEIA,
};
