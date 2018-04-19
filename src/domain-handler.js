'use strict'

const repository = require('./repository')

const domainHandler = async function domainHandler (ctx) {
  console.log('Domain Router')
  let pathdata = ctx.params[0].split('/')
  let res
  if (pathdata.length === 1) {
    res = await repository.getList(pathdata[0])
  }
  if (pathdata.length === 2 && !isNaN(pathdata[1])) {
    res = await repository.getObject(pathdata[0], pathdata[1])
  }
  ctx.body = res
}

module.exports = domainHandler
