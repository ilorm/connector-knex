const { expect, } = require('chai');

// Create a clean instance of ilorm :
const Ilorm = require('ilorm').constructor;
const ilormKnex = require('..');
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    user : 'root',
    password : 'root',
    database : 'test',
    multipleStatements: true
  }
});
knex.on('query', function( queryData ) {
  console.log(queryData.sql, queryData.bindings);
});

const knexConnection = ilormKnex.fromKnex(knex);

const ilorm = new Ilorm();

ilorm.use(ilormKnex);
const { Schema, newModel, } = ilorm;

// Declare schema :
const userSchema = new Schema({
  firstName: Schema.string(),
  lastName: Schema.string()
});

const modelConfig = {
  name: 'invoices', // Optional, could be useful to know the model name
  schema: userSchema,
  connector: new knexConnection({ tableName: 'users' }),
};

const User = newModel(modelConfig);

describe('spec ilorm knex', () => {
  describe('Should insert data into database', () => {
    before(async () => {
      await knex.schema.createTable('users', (table) => {
        table.string('firstName');
        table.string('lastName');
      });
    });

    after(async () => {
      await knex.schema.dropTable('users');

      knex.destroy();
    });

    it('Should insert data with model saving', async () => {
      const user = new User();
      user.firstName = 'test';
      user.lastName = 'anotherTest';

      await user.save();
    });
  });
});
