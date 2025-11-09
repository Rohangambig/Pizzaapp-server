const logger = require('../util/logger');

class APIError extends Error {
    constructor(statusCode,message){
        super(message);
        this.statusCode = statusCode;
    }
}

const asyncHandler = (fn) => async (req,res,next) => {
    try {
        await fn(req,res,next);
    }catch(err) {
        next(err);
    }
};

const errorHandler = (err,req,res,next) => {
    logger.error({message:err.message || "Internal server error", userId:req.user?._id || 'unknown user',username:req.user?.username || 'unknown user'});

    return res.status(err.statusCode || 500).json({
        success:false,
        message:err.message || "Internal server error" 
    });
};

module.exports = {  APIError , asyncHandler , errorHandler };