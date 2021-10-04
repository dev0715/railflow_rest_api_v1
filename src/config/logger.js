const winston = require("winston");

// Imports the Google Cloud client library for Winston
const { LoggingWinston } = require("@google-cloud/logging-winston");

const loggingWinston = new LoggingWinston({
  keyFilename: "railflow-gcp-prod.json",
});

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
    loggingWinston,
  ],
});

module.exports = logger;
