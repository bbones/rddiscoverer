/* global describe, it */
'use strict'

const expect = require('chai').expect
const dict = [
  ['object', {
    'PK': 'object_id',
    'FKs': [
      {
        column_name: 'object_type_id',
        constraint_name: 'Refobject_type97',
        foreign_column_name: 'object_type_id',
        foreign_table_name: 'object_type',
        foreign_table_schema: 'keeper',
        table_name: 'object',
        table_schema: 'keeper'
      },
      {
        column_name: 'parent_object_id',
        constraint_name: 'Refobject74',
        foreign_column_name: 'object_id',
        foreign_table_name: 'object',
        foreign_table_schema: 'keeper',
        table_name: 'object',
        table_schema: 'keeper'
      }
    ]
  }]
]

var JSONAPI = require('../src/jsonapi')
const jsna = new JSONAPI(new Map(dict))

describe('JSONAPI', () => {
  it('* create', () => {
    expect(jsna).is.an('object')
  })
  it('* encode plain', () => {
    expect(jsna.encode('object', {
      object_id: 11,
      parent_object_id: 4,
      object_type_id: 10
    })).to.deep.equal(`{'type': 'object', 'id': 11}`)
  })
  it('* decode', () => {
    expect(jsna.decode(`{
      "id": "3",
      "parent_object_id": "4",
      "object_type_id": "10"
    }`))
  })
})
