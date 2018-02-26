'use strict'

const pluralize = require('pluralize')
const repository = require('./repository')

const domainHandler = async function domainHandler (ctx) {
  console.log('Domain Router')
  let pathdata = ctx.params[0].split('/')
  let res
  if (pathdata.length === 1) {
    // res = repository.knex(pluralize.singular(pathdata[0])).withSchema('keeper').select('*').toSql()
    res = repository.knex(pluralize.singular(pathdata[0]))
      .withSchema('keeper').select('*')
      .where(repository.knex.raw('object_id = ?', [1]))
      .toSQL()
  }
  if (pathdata.length === 2 && !isNaN(pathdata[1])) {
    res = repository.knex(pluralize.singular(pathdata[0]))
      .withSchema('keeper').select('*')
      .where('object_id', 1)
      .toSQL()
  }
  ctx.body = res
}

module.exports = domainHandler
