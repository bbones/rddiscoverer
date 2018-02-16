const { Client } = require('pg')
const client = new Client(process.env.DATABASE_URL)

class MetaHandler {
  async tablesList (ctx) {
    console.log('Table list request')
    try {
      await client.connect()
      let res = await client.query('select schema_name from information_schema.schemata')
      ctx.body = res.rows
    } catch (e) {
      ctx.body = e
    }
  }
}
const metaHandler = new MetaHandler()
module.exports = metaHandler
