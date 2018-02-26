const { Client } = require('pg')
const client = new Client(process.env.DATABASE_URL)
const repository = require('./repository')

class MetaHandler {
  async tablesList (ctx) {
    console.log('Table list request')
    try {
      await client.connect()
      let res = await client
        .query('SELECT table_name FROM information_schema.tables')
      ctx.body = res.rows
    } catch (e) {
      ctx.body = e
    }
  }

  async schemasList (ctx) {
    console.log('Table list request')
    try {
      await client.connect()
      let res = await client
        .query('select schema_name from information_schema.schemata')
      ctx.body = res.rows
    } catch (e) {
      ctx.body = e
    }
  }

  async initrepo (ctx) {
    console.log('Init repo')
    await repository.init()
    ctx.body = 'Success!'
  }
}
const metaHandler = new MetaHandler()
module.exports = metaHandler
