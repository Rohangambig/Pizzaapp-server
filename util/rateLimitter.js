const { rateLimit } = require('express-rate-limit');
const { APIError } = require('./errorHandler');

const Limiter = rateLimit({
    windowMs:15 * 60 * 1000,
    limit : 50,
    standardHeaders:true,
    keyGenerator: (req, res) => {
        return req.user ? req.user._id : req.ip; 
    },
    message:{
        error:"Too many requests...."
    },
    handler :(req, res, next) => {
         next(new APIError(429, "Too many requests, please try again later."));
    }
});

module.exports = Limiter;