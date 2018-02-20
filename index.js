const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()
const metaHandler = require('./src/meta-handlers')
const domainHandler = require('./src/domain-handler')

router.get('/domain/*', domainHandler)

router.get('/meta/tablesList/', metaHandler.tablesList)
router.get('/meta/schemasList/', metaHandler.schemasList)

app
  .use(router.allowedMethods())
  .use(router.routes())
  .use(require('koa-body')())

app.use(async ctx => {
  ctx.body = 'Hello World'
})

app.listen(3000, function () {
  console.log('Koa is listening to http://localhost:3000')
})
