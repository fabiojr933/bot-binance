const knex = require('knex')({
    client: 'pg',
    version: '14.2',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'postgres',
      database : 'binance'
    }
  });
  module.exports = knex;