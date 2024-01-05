//src/middlewares/useCacheIfStored.js
const { redisGet } = require('../redis/redis');
const redisHelper = require('../redis/redisHelper');
const ErrorObject = require('../utils/ErrorObject');

function useCacheIfStored(queryType, successMessage = 'Successfully retrieved from Cache!') {
  return async function cacheData(req, res, next) {
    const cacheKey = redisHelper.getRedisKey(queryType, req);
    try {
      const cacheResults = await redisGet(cacheKey);
      console.log('REDIS_LOG', queryType, cacheKey, cacheResults);
      if (cacheResults) {
        let results = JSON.parse(cacheResults);

        res.send({
          message: results.message || successMessage,
          success: results.success,
          fromCache: true,
          data: results.data,
        });
      } else {
        next();
      }
    } catch (e) {
      console.log('Error in Cache get: ', e);
      next(new Error(500, `Something went wrong in Cache!${e}`));
    }
  };
}

module.exports = useCacheIfStored;
