const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 20,
    message: { message: "Too many attempts, please try again later"}
})

module.exports = limiter