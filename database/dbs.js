const mongoose = require('mongoose');
const logger = require('../util/logger');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected...");
        // logger.info("database connected successfully");
    }catch(err) {
        logger.error('Error in database connection');
        process.exit(1);
    }
};

module.exports = connectDB;