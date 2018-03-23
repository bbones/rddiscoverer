/* global describe, it, before */
'use strict'
var expect = require('chai').expect

const repository = require('../../src/repository')

describe('Repository', () => {
  before(async function () {
    await repository.init()
  })

  describe('* Metadata', () => {
    it('Dictionary length test', async function () {
      expect(Object.keys(repository.dictionary).length).to.equal(40)
    })
    it('#getPKColumn', async function () {
      let res = await repository.getPKColumn('object')
      expect(res).to.equal('object_id')
    })
    it('#getFKColumns', async function () {
      let res = await repository.getFKColumns('bk_entry')
      // console.log(res.rows)
      expect(res.rows.length).to.equal(4)
    })
  })

  describe('* getObjectList', () => {
    it('#getObjectList', async function () {
      let res = await repository.getList('objects')
      expect(res.length).to.equal(22)
    })
  })

  describe('* getObject', () => {
    it('#getObject', async function () {
      let res = await repository.getObject('objects', 2)
      expect(res.data[0].object_id).to.equal(2)
      expect(res.include).to.an('undefined')
    })

    it('#getObject with include many-to-one', async function () {
      let res = await repository.getObject('objects', 2,
        {include: 'object_type'})
      expect(res.data[0].object_id).to.equal(2)
      expect(res.include).to.an('object')
    })
  })
})
