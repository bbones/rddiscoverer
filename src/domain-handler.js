'use strict'
// const { Client } = require('pg')
const Url = require('url')

class DomainHandler {
  decodePathName (str) {
    return str.split('/')
  }

  async run (ctx) {
    console.log('Domain Router')
    // const client = new Client(process.env.DATABASE_URL)
    const myURL = Url.parse(ctx.url)
    let pathdata = this.decodePathName(myURL.pathname)
    ctx.body = pathdata
    // try {
    //   await client.connect()
    // } catch (e) {
    //   console.log('catched', e)
    //   ctx.body = e
    // } finally {
    //   console.log('finally')
    //   await client.end()
    // }
  }
}

const domainHandler = new DomainHandler()
module.exports = domainHandler.run
