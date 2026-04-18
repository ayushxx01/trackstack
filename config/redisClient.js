const redis = require("redis");

const redisClient = redis.createClient({
    url: "redis://localhost:6379"
})

redisClient.on("error", (err)=> console.log("redis error: ", err));
redisClient.on("connected", ()=> console.log("connected"));

module.exports = redisClient;