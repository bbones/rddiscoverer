'use strict'

const Koa = require('koa')
const koaBody = require('koa-body')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()
const metaHandler = require('./src/meta-handlers')
const {
  getDomainHandler,
  postDomainHandler,
  patchDomainHandler,
  deleteDomainHandler} = require('./src/domain-handler')
const {repository} = require('./src/repository')

repository.init()

router.get('/domain/*', getDomainHandler)
router.post('/domain/*', koaBody(), postDomainHandler)
router.patch('/domain/*', koaBody(), patchDomainHandler)
router.delete('/domain/*', koaBody(), deleteDomainHandler)

router.get('/meta/tablesList/', metaHandler.tablesList)
router.get('/meta/schemasList/', metaHandler.schemasList)
router.get('/meta/initrepo', metaHandler.initrepo)

app
  .use(router.allowedMethods())
  .use(router.routes())
  .use(koaBody())

app.use(async ctx => {
  ctx.body = 'Hello World'
})

app.listen(3000, function () {
  console.log('Koa is listening to http://localhost:3000')
})
