'use strict'

const pluralize = require('pluralize')

const knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL
})

class Repository {
  constructor () {
    this.dict = {}
  }

  async init () {
    try {
      let res = await knex.raw(
        `select tc.table_schema, tc.table_name, kc.column_name
          from
            information_schema.table_constraints tc,
            information_schema.key_column_usage kc
          where
            tc.constraint_type = 'PRIMARY KEY'
            and kc.table_name = tc.table_name and kc.table_schema = tc.table_schema
            and kc.constraint_name = tc.constraint_name
          order by 1, 2;`)
      res.rows.forEach(function (element) {
        this.dict[element.table_name] = element.column_name
      }, this)
    } catch (err) {
      console.log(err)
    }
  }

  getPKColumn (tabname) {
    return this.dict[tabname]
  }

  async getList (collection) {
    let res = knex(pluralize.singular(collection))
      .withSchema('keeper')
      .select('*')
    return res
  }

  async getObject (collection, id, opt) {
    let res = await knex(pluralize.singular(collection))
      .withSchema('keeper')
      .select('*').where(this.getPKColumn(pluralize.singular(collection)), id)
    if (opt && opt.include) {
      return {data: res, include: {}}
    }
    return {data: res}
  }

  get knex () {
    return knex
  }

  get dictionary () {
    return this.dict
  }
}

const repository = new Repository()
repository.init()

module.exports = repository
