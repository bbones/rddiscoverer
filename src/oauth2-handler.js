'use strict'


exports.getAccessToken = async function (ctx) {
  console.log('getAccessToken')
  // let code = ctx
  ctx.body = ctx.query
}
