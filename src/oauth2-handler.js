'use strict'

const GITHUB_GET_TOKEN_URL = 'https://github.com/login/oauth/access_token'
const GITHUB_GET_USER_INFO = 'https://api.github.com/user'
const CLIENT_ID = 'f2bbf11a5c4756665e78'
const CLIENT_SECRET = 'f5f8c6db3569cab396dde120a6c4c62176a09de9'

const qs = require('qs')
const axios = require('axios')

exports.getAccessToken = async function (ctx) {
  console.log('getAccessToken')
  let result = await axios.post(GITHUB_GET_TOKEN_URL, {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: ctx.query.code
  })
  const query = qs.parse(result.data)
  console.log(query.access_token)
  ctx.body = {
    token: query.access_token
  }
}

exports.getUserInfo = async function (ctx) {
  console.log('getUserInfo')
  console.log(ctx.headers.authorization)
  // Redirect to GitHub
  let user = await axios.get(GITHUB_GET_USER_INFO, {
    headers: {
      Authorization: `${ctx.headers.authorization}`
    }
  })
  console.log(user.data.login)
  ctx.body = user.data
}
