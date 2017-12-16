'use strict'

var mocha = require('mocha')
var should = require('should')

var cache
var options = {
  host: '127.0.0.1',
  port: 6379,
  options: {
    db: 10
  }
}

before((done) => {
  done()
})

describe('Module', () => {
  it('should be a function', () => {
    cache = require('../')
    cache.should.be.a.function
  })

  it('should return a object', (done) => {
    cache = cache(options)
    cache.constructor.name.should.equal('Object')
    done()
  })
})

after((done) => {
  done()
})
