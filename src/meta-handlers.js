const { Client } = require('pg')
const Url = require('url')
const client = new Client(process.env.DATABASE_URL)

class MetaHandler {
  async tablesList (ctx) {
    console.log('Table list request')
    try {
      await client.connect()
      let res = await client
        .query('SELECT table_name FROM information_schema.tables')
      const myURL = new Url(ctx.url)
      console.log(ctx.url)
      console.log(myURL)
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
}
const metaHandler = new MetaHandler()
module.exports = metaHandler
