/* global describe, it, before */
'use strict'
var expect = require('chai').expect

const {repository, RelationType} = require('../../src/repository')

describe('Repository', () => {
  before(async function () {
    await repository.init()
  })

  describe('* Metadata', () => {
    it('Dictionary length test', async function () {
      // console.log(repository.dictionary)
      expect(repository.dictionary.size).to.equal(40)
    })
    it('Dictionary completeness test', async function () {
      expect(repository.dictionary.get('bk_entry').FKs.length).to.equal(4)
    })
    it('#getPKColumn', async function () {
      let res = await repository.getPKColumn('object')
      expect(res).to.equal('object_id')
    })
    it('#getFKColumns', async function () {
      let res = await repository.getFKColumns('bk_entry')
      expect(res.length).to.equal(4)
    })
    it('#getRelationType', function () {
      expect(repository.getRelationType('object', 'object_type_id'))
        .to.equal(RelationType.MANY_TO_ONE)
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
        {include: 'object_type,i18n_data,object_type.i18n_data'})
      expect(res.data[0].object_id).to.equal(2)
      expect(res.include).to.an('object')
    })
  })
})
