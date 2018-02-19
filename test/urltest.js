/* global describe it */
const Url = require('url')
var expect = require('chai').expect

describe('URL Testing', function () {
  it('URL fields', function () {
    let parsed =
      Url
        .parse('https://example.com/objects/25?include=test,test.one',
          true)
    console.log(parsed)
    expect(parsed.pathname).to.equal('/objects/25')
    expect(parsed.query.include).to.equal('test,test.one')
  })
})
