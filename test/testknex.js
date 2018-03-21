/* global describe, it, after */

var expect = require('chai').expect
const knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL
})

describe('Knex tests', function () {
  after(() => knex.destroy())
  it('Check process.env.DATABASE_URL', function () {
    expect(process.env.DATABASE_URL).to.be.a('string')
  })
  it('#select', async function () {
    let data = await knex('object').withSchema('keeper').select('object_id')
    expect(data.length).to.equal(22)
  })
})
