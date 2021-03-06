'use strict'

const pluralize = require('pluralize')
const JSONAPI = require('./jsonapi')

const knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  searchPath: 'keeper'
})

const RelationType = Object.freeze({
  ONE_TO_ONE: Symbol('one_to_one'),
  ONE_TO_MANY: Symbol('one_to_many'),
  MANY_TO_ONE: Symbol('many_to_one')
})

class Repository {
  constructor () {
    this.dict = new Map()
    this.JSONAPI = new JSONAPI(this.dict)
  }

  async init () {
    console.log('Init repo...')
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
      for (let entry of res.rows) {
        let fk = await this.getFKColumns(entry.table_name)
        this.dict.set(entry.table_name, {
          PK: entry.column_name,
          FKs: fk
        })
      }
      console.log('Init repo finished')
    } catch (err) {
      console.log(err)
    }
  }

  async stop () {
    try {
      await knex.destroy()
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
  async getList (collection, opt) {
    let table = pluralize.singular(collection)
    let res = await knex(table)
      // .withSchema('keeper')
      .select('*')
    let ret = {data: res}
    if (opt && opt.include) {
      // include  section analysis
      if (opt.include) {
        ret['include'] = {}
        for (let entity of opt.include.split(',')) {
          // if relation is MANY_TO_ONE
          let ref = this.dict.get(table).FKs.find(fk => {
            return fk.foreign_table_name === pluralize.singular(entity)
          })
          if (ref) {
            // collect referenced IDs in Set
            let ids = new Set(res.map(item => item[ref.column_name]))
            ret.include[entity] = await knex(pluralize.singular(entity))
              .whereIn(ref.foreign_column_name, Array.from(ids))
              .withSchema(ref.foreign_table_schema)
          } else {
            // if relation is ONE_TO_MANY
            let refTab = pluralize.singular(entity)
            let ref = this.dict.get(refTab).FKs.find(fk => {
              return fk.foreign_table_name === table
            })
            if (ref) {
              let ids = new Set(res.map(item => item[ref.foreign_column_name]))
              ret.include[entity] = await knex(refTab)
                .whereIn(ref.column_name, Array.from(ids))
                .withSchema(ref.table_schema)
            }
          }
        }
      }
    }
    return ret
  }

  async getObject (collection, id, opt) {
    // get the main object
    let table = pluralize.singular(collection)
    let res = await knex(table)
      .select('*').where(this.getPKColumn(pluralize.singular(collection)), id)
    let ret = {data: res}
    if (opt && opt.include) {
      // include  section analysis
      if (opt.include) {
        ret['include'] = {}
        for (let entity of opt.include.split(',')) {
          // if relation is MANY_TO_ONE
          let ref = this.dict.get(table).FKs.find(fk => {
            return fk.foreign_table_name === pluralize.singular(entity)
          })
          if (ref) {
            ret.include[entity] = await knex(pluralize.singular(entity))
              .where(ref.foreign_column_name, res[0][ref.column_name])
              .withSchema(ref.foreign_table_schema)
          } else {
            // if relation is ONE_TO_MANY
            let ref = this.dict.get(pluralize.singular(entity)).FKs.find(fk => {
              return fk.foreign_table_name === table
            })
            if (ref) {
              ret.include[entity] = await knex(entity)
                .where(ref.column_name, res[0][ref.foreign_column_name])
                .withSchema(ref.table_schema)
            }
          }
        }
      }
    }
    return ret
  }

  async create (collection, obj) {
    let table = pluralize.singular(collection)
    obj.created_at = obj.updated_at = new Date()
    obj.version = 0
    obj = await knex(table).insert(obj).returning('*')
    return JSONAPI.encode(collection, obj)
  }

  async patch (collection, id, version, obj) {
    let table = pluralize.singular(collection)
    obj.updated_at = new Date()
    obj.version++
    let whereClause = {version: version}
    whereClause[this.dict.get(table).PK] = id
    obj = await knex(table).update(obj).where(whereClause)
    return {data: obj}
  }

  async delete (collection, id, version) {
    let table = pluralize.singular(collection)
    let whereClause = {version: version}
    whereClause[this.dict.get(table).PK] = id
    let obj = await knex(table).delete().where(whereClause)
    return {data: obj}
  }

  get knex () {
    return knex
  }

  get dictionary () {
    return this.dict
  }

  getRelationType (entity, includedEntity) {
    if (this.dict.get(entity).FKs.find(fk => {
      return fk.foreign_table_name === includedEntity
    })) {
      return RelationType.MANY_TO_ONE
    } else {
      return RelationType.ONE_TO_MANY
    }
  }
}

const repository = new Repository()

module.exports = {repository: repository, RelationType: RelationType}
