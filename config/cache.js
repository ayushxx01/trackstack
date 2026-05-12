const client = require('../config/redisClient');

const invalidateCache = async (usedId) => {
    const catchedKey = `stats:${usedId}`;
    await client.del(catchedKey);
}

module.exports = invalidateCache;