'use strict'

const {repository} = require('./repository')

exports.getDomainHandler = async function (ctx) {
  console.log('get Domain Router')
  let pathdata = ctx.params[0].split('/')
  let res
  if (pathdata.length === 1) {
    res = await repository.getList(pathdata[0], ctx.query)
  }
  if (pathdata.length === 2 && !isNaN(pathdata[1])) {
    res = await repository.getObject(pathdata[0], pathdata[1], ctx.query)
  }
  ctx.body = res
}

exports.postDomainHandler = async function (ctx) {
  console.log('post Domain Router')
  ctx.body = await repository.create(ctx.params[0], ctx.request.body)
}

exports.patchDomainHandler = async function (ctx) {
  console.log('patch Domain Router')
  let pathdata = ctx.params[0].split('/')
  ctx.body = await repository.patch(pathdata[0], pathdata[1],
    ctx.request.body.version, ctx.request.body)
}

exports.deleteDomainHandler = async function (ctx) {
  console.log('delete Domain Router')
  let pathdata = ctx.params[0].split('/')
  ctx.body = await repository.patch(pathdata[0], pathdata[1],
    ctx.request.body.version, ctx.request.body)
}
