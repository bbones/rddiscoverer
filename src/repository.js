'use strict'

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

  async getPKColumn (tabname) {
    return this.dict[tabname]
  }

  get knex () {
    return knex
  }
}

const repository = new Repository()
repository.init()

module.exports = repository
