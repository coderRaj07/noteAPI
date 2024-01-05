// src/redis/redisHelper.js
const REDIS_QUERY_TYPE = {
  GET_NOTES: 'GET_NOTES',
  GET_NOTE_BY_ID: 'GET_NOTE_BY_ID',
  CREATE_NOTE: 'CREATE_NOTE',
  UPDATE_NOTE: 'UPDATE_NOTE',
  DELETE_NOTE: 'DELETE_NOTE',
  SHARE_NOTE: 'SHARE_NOTE',
  SEARCH_NOTES: 'SEARCH_NOTES',
};
 
function getRedisKey(queryType, req) {
  const userId = req.user._id;
  const noteId = req.params.id;

  switch (queryType) {
    case REDIS_QUERY_TYPE.GET_NOTES:
      return `GET_NOTES_${userId}`;
    case REDIS_QUERY_TYPE.GET_NOTE_BY_ID:
      return `GET_NOTE_${noteId}_${userId}`;
    case REDIS_QUERY_TYPE.CREATE_NOTE:
      return `CREATE_NOTE_${userId}`;
    case REDIS_QUERY_TYPE.UPDATE_NOTE:
      return `UPDATE_NOTE_${noteId}_${userId}`;
    case REDIS_QUERY_TYPE.DELETE_NOTE:
      return `DELETE_NOTE_${noteId}_${userId}`;
    case REDIS_QUERY_TYPE.SHARE_NOTE:
      return `SHARE_NOTE_${noteId}_${userId}`;
    case REDIS_QUERY_TYPE.SEARCH_NOTES:
      const query = req.query.q || '';
      return `SEARCH_NOTES_${query}_${userId}`;
    default:
      throw new Error('Key not defined for redis.');
  }
}

module.exports = { getRedisKey, REDIS_QUERY_TYPE };

