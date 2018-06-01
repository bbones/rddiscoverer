'use strict'
const pluralize = require('pluralize')

class JSONAPI {
  constructor (dict) {
    this.dict = dict
  }
  encode (type, obj) {
    let table = pluralize.singular(type)
    let result = {'type': type, 'id': obj[this.dict.get(table).PK]}
    return result
  }
}

module.exports = JSONAPI
