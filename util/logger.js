const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
    level:'info',
    format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf(({ timestamp, message, ...meta }) => {
                return JSON.stringify({
                    timestamp,
                    message,
                    ...meta
                });
            }),
            winston.format.prettyPrint()
        ),
    transports:[
        new winston.transports.File({
            filename:path.join(__dirname,'logs','info.log'),
            level:'info'
        }),
        new winston.transports.File({
            filename:path.join(__dirname,"logs","error.log"),
            level:'error'
        })
    ]
});

module.exports = logger;