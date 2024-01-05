// redisUtils.js
const Redis = require('ioredis');

// Create an ioredis client
const redisClient = new Redis();

// Utility function to promisify ioredis get and set operations
async function promisifiedGet(key) {
  const reply = await redisClient.get(key);
  return JSON.parse(reply);
}

async function promisifiedSet(key, value) {
  return redisClient.set(key, JSON.stringify(value));
}

module.exports = { redisClient, promisifiedGet, promisifiedSet };
