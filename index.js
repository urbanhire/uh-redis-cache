'use strict'

const fastStringify = require('fast-safe-stringify')
const JSONparse = require('fast-json-parse')
const redisPoolCon = require('redis-pool-connection')

const createClient = (config) => {
  if (!config) {
    throw new Error(`Api libs need a config object`)
  }

  const redisClient = redisPoolCon(config)

  const redisCache = {
    redisClient: redisClient,
    get: (key, callback) => {
      redisClient.get(key, (err, response) => {
        if (!err && response) {
          const data = JSONparse(response)

          callback(data.value)
        } else {
          callback(null)
        }
      })
    },
    set: (key, data) => redisClient.set(key, fastStringify(data)),
    setex: (key, ttl, data) => redisClient.setex(key, ttl || 60, fastStringify(data)),
    del: (key) => redisClient.del(key),
    delwild: (key) => redisClient.delwild(key),
    uhSearch: {
      del: (key) => redisClient.del(key),
      delwild: (key) => redisClient.delwild(key)
    },
    v2_get: (key) => {
      return new Promise((resolve, reject) => {
        redisClient.get(key, (err, response) => {
          if (!err && response) {
            const data = JSONparse(response)
            resolve(data.value)
          } else {
            if (err) reject(err)
            else resolve(null)
          }
        })
      })
    },
    hset: (hash, field, data) => redisClient.hset(hash, field, fastStringify(data)),
    hget: (hash, field, callback) => {
      redisClient.hget(hash, field, (err, response) => {
        if (!err && response) {
          const data = JSONparse(response)

          callback(data.value)
        } else {
          callback(null)
        }
      })
    },
    v2_hget: (hash, field) => {
      return new Promise((resolve, reject) => {
        redisClient.hget(hash, field, (err, response) => {
          if (!err && response) {
            const data = JSONparse(response)
            resolve(data.value)
          } else {
            if (err) reject(err)
            else resolve(null)
          }
        })
      })
    },
    hdel: (hash, field) => redisClient.hdel(hash, field),
    expire: (key, ttl) => redisClient.expire(key, ttl),
    ttl: {
      FIVE_MINUTE: 300,
      TEN_MINUTE: 600,
      HALF_HOUR: 1800,
      ONE_HOUR: 3600,
      TWO_HOUR: 7200,
      SIX_HOUR: 21600
    }
  }
  return redisCache
}

module.exports = createClient
