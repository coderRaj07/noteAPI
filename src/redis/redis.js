const redis = require('redis');
const { promisify } = require('util');

const REDIS_URL = 'redis://localhost:6379';

const client = redis.createClient({
   host: '127.0.0.1', port: 6379 
});

const setAsyncExPromise = promisify(client.set).bind(client);
const getAsyncPromise = promisify(client.get).bind(client);
const delAsyncPromise = promisify(client.del).bind(client);

client.on('error', (err) => {
  console.log('Error in redis client: ' + err);
});

async function redisSaveWithTtl(key, value, ttlSeconds = 60) {
  const multi = client.multi();
  multi.set(key, JSON.stringify(value));
  multi.expire(key, ttlSeconds);
  return await promisify(multi.exec).bind(multi)();
}

async function redisSave(key, value) {
  return await setAsyncExPromise(key, JSON.stringify(value));
}

async function redisDeleteKey(key) {
  return await delAsyncPromise(key);
}

async function redisGet(key) {
  const jsonString = await getAsyncPromise(key);
  return jsonString ?? null;
}

module.exports = {
  redisGet,
  redisDeleteKey,
  redisSave,
  redisSaveWithTtl,
};

