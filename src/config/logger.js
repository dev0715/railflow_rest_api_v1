const winston = require("winston");

const logger = winston.createLogger({
  //   level: "info",
  colorize: true,
  transports: [
    new winston.transports.Console({
      level: "verbose",
      format: winston.format.combine(
        // winston.format.timestamp(),
        winston.format.prettyPrint(),
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

module.exports = logger;
