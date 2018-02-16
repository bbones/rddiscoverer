const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()
const metaHandler = require('./src/meta-handlers')

router.get('/domain/*', ctx => {
  console.log(ctx)
  ctx.body = ctx
})

router.get('/meta/tablesList/', metaHandler.tablesList)

app
  .use(router.allowedMethods())
  .use(router.routes())
  .use(require('koa-body')())

app.use(async ctx => {
  ctx.body = 'Hello World'
})

app.listen(3000)
