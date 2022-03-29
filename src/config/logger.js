const winston = require('winston')
// const { Logtail } = require('@logtail/node')
// const { LogtailTransport } = require('@logtail/winston')

// // Create a Logtail client
// const logtail = new Logtail('xTkwgvG9woJf1ciDrYup27FR')

// // Create a Winston logger - passing in the Logtail transport
// const logger_live = winston.createLogger({
//   transports: [new LogtailTransport(logtail)],
// })

// const logger = winston.createLogger({
//   //   level: "info",
//   colorize: true,
//   transports: [
//     new winston.transports.Console({
//       level: 'verbose',
//       format: winston.format.combine(
//         // winston.format.timestamp(),
//         winston.format.prettyPrint(),
//         winston.format.colorize(),
//         winston.format.simple()
//       ),
//     }),
//   ],
// })

const LogzioWinstonTransport = require('winston-logzio')

const logzioWinstonTransport = new LogzioWinstonTransport({
  level: 'info',
  name: 'winston_logzio',
  token: 'ynrwSYxoEcmqrsKGUWaZhVewrPiUtMYg',
  host: 'listener.logz.io',
  port: '8071',
  protocol: 'https',
})

const logger = winston.createLogger({
  format: winston.format.simple(),
  transports: [logzioWinstonTransport],
})

module.exports = logger
