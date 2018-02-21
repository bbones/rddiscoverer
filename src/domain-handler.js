'use strict'

const knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL
})
const pluralize = require('pluralize')

const domainHandler = async function domainHandler (ctx) {
  console.log('Domain Router')
  let pathdata = ctx.params[0].split('/')
  ctx.body = await knex(pluralize.singular(pathdata[0])).withSchema('keeper').select('*')
}

module.exports = domainHandler
