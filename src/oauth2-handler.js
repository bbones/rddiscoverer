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
  console.log(result.data)
  const query = qs.parse(result.data)
  console.log(query.access_token)
  let user = await axios.get(GITHUB_GET_USER_INFO, {
    headers: {
      Authorization: `token ${query.access_token}`
    }
  })
  console.log(user.data)
  ctx.body = {
    token: query.access_token,
    user: user.data
  }
}
