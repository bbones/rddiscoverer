/* global describe, it, before */
'use strict'
var expect = require('chai').expect

const repository = require('../../src/repository')

describe('Repository', () => {
  before(async function () {
    await repository.init()
  })

  it('#getPKColumn', async function () {
    expect(Object.keys(repository.dictionary).length).to.equal(40)
    let res = await repository.getPKColumn('object')
    expect(res).to.equal('object_id')
  })

  it('#getObjectList', async function () {
    let res = await repository.getList('objects')
    expect(res.length).to.equal(22)
  })

  it('#getObject', async function () {
    let res = await repository.getObject('objects', 2)
    expect(res[0].object_id).to.equal(1)
  })

  it('#test include', async function () {
    expect(repository.query.result.length).to.equal(0)
    let res = await repository.getObject('objects', 2,
      {include: 'object_type'})
    expect(res[0].object_id).to.equal(1)
  })
})
