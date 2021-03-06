/* global describe, it */
var pluralize = require('pluralize')
var expect = require('chai').expect

describe('Pluralize', function () {
  describe('singular to plural', function () {
    it('#datum-data', function () {
      expect(pluralize.plural('datum')).to.equal('data')
    })

    it('#object-objects', function () {
      expect(pluralize.plural('object')).to.equal('objects')
    })

    it('#person-people', function () {
      expect(pluralize.plural('person')).to.equal('people')
    })
  })

  describe('singular to plural', function () {
    it('#data-datum', function () {
      expect(pluralize.singular('data')).to.equal('datum')
    })

    it('#objects-object', function () {
      expect(pluralize.singular('objects')).to.equal('object')
    })

    it('#people-person', function () {
      expect(pluralize.singular('people')).to.equal('person')
    })
  })
})
