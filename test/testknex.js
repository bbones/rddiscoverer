/* global describe, it */
const knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL
})

describe('Knex tests', function () {
  it('#select', async function () {
    console.log(await knex('object').withSchema('keeper').select('object_id'))
  })
})
