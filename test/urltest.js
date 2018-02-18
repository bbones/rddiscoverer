const Url = require('url')
var expect = require('chai').expect

describe('URL Testing', function() {
  it('URL fields', function() {
    console.log(Url.parse('https://example.com/objects/25?include=tet,test.one'));
  })
})
