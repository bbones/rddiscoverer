const { Client } = require('pg')
const Url = require('url')

class DomainHandler {
  async run (ctx) {
    console.log('Domain Router')
    const client = new Client(process.env.DATABASE_URL)
    try {
      await client.connect()
      const myURL = Url.parse(ctx.url)
      ctx.body = myURL
    } catch (e) {
      console.log('catched', e)
      ctx.body = e
    } finally {
      console.log('finally')
      await client.end()
    }
  }
}

const domainHandler = new DomainHandler()
module.exports = domainHandler
