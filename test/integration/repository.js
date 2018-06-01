/* global describe, it, before, after */
'use strict'
var expect = require('chai').expect

const {repository, RelationType} = require('../../src/repository')

describe('Repository', () => {
  before(async function () {
    await repository.init()
  })

  after(async () => {
    await repository.stop()
  })

  describe('* Metadata', () => {
    it('Dictionary length test', async function () {
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
    describe('* getRelationType', function () {
      it('#get MANY_TO_ONE', function () {
        expect(repository.getRelationType('object', 'object_type'))
          .to.equal(RelationType.MANY_TO_ONE)
      })
      it('#get ONE_TO_MANY', function () {
        expect(repository.getRelationType('object', 'i18n_data'))
          .to.equal(RelationType.ONE_TO_MANY)
      })
    })
  })

  describe('* getObjectList', () => {
    it('#getObjectList', async function () {
      let res = await repository.getList('objects')
      expect(res.data.length).to.equal(20)
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
        {include: 'object_type,i18n_datum'})
      expect(res.data[0].object_id).to.equal(2)
      expect(res.include).to.an('object')
      expect(res.include.object_type).to.an('array')
    })

    it('#getObject with include one-to-many', async function () {
      let res = await repository.getObject('objects', 2,
        {include: 'object_type,i18n_datum'})
      expect(res.data[0].object_id).to.equal(2)
      expect(res.include).to.an('object')
      expect(res.include.i18n_datum).to.an('array')
    })
  })

  describe('* postObject', () => {
    it('postObject', async function () {
      let res = await repository.create({parent_object_id: 4})
      expect(res.data).to.an('object')
      expect(res.data.id).to.a('number')
    })
  })
})
