'use strict'

const pluralize = require('pluralize')

const knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL
})

class Repository {
  constructor () {
    this.dict = new Map()
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
      for(let entry of res.rows) {
        let fk = await this.getFKColumns(entry.table_name)
        this.dict.set(entry.table_name, {
          PK: entry.column_name,
          FKs: fk
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  getPKColumn (tabname) {
    return this.dict.get(tabname).PK
  }

  async getFKColumns (tabname) {
    try {
      let res = await knex.raw(`
        SELECT
          tc.table_schema, tc.constraint_name, tc.table_name, kcu.column_name,
          ccu.table_schema AS foreign_table_schema,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM
          information_schema.table_constraints AS tc
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
        WHERE constraint_type = 'FOREIGN KEY' AND tc.table_name=?`, [tabname])
      return res.rows
    } catch (err) {
      console.log(err)
    }
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
