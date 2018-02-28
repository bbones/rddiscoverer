/* global describe, it */
'use strict'
var expect = require('chai').expect

const repository = require('../../src/repository')

describe('Repository', () => {
  it('#init', () => {
    repository.init()
    expect(repository.getPKColumn('object')).to.equal('object_id')
  })
})
