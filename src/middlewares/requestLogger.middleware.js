const appConfig = require('../../configs/app')

const config = appConfig.getConfigs()

const UUID = require('uuid')

// logger middleware.js
/**
 * Interceptor function used to monkey patch the res.send until it is invoked
 * at which point it intercepts the invokation, executes is logic such as res.contentBody = content
 * then restores the original send function and invokes that to finalize the req/res chain.
 *
 * @param res Original Response Object
 * @param send Original UNMODIFIED res.send function
 * @return A patched res.send which takes the send content, binds it to contentBody on
 * the res and then calls the original res.send after restoring it
 */
const resDotSendInterceptor = (res, send) => (content) => {
  res.contentBody = content
  res.send = send
  res.send(content)
}

/**
 * Middleware which takes an initial configuration and returns a middleware which will call the
 * given logger with the request and response content.
 *
 * @param logger Logger function to pass the message to
 * @return Middleware to perform the logging
 */
const requestLoggerMiddleware =
  ({ logger }) =>
  (req, res, next) => {
    req._startTime = new Date()

    let uuid = UUID.v4()
    if (req.method == 'POST' || req.method == 'PATCH' || req.method == 'PUT') {
      logger(`${req.method}  ${req.baseUrl}    ${uuid}    Body:`, { requestId: uuid, ...req.body })
    }
    res.send = resDotSendInterceptor(res, res.send)
    res.on('finish', () => {
      res._startTime = new Date()

      logger(
        `${req.method}  ${req.baseUrl}  ${uuid}  ${
          new Date(res._startTime) - new Date(req._startTime)
        } ms - ${res.statusCode || res.status}`
      )
      if (config.LOG_RESPONSE) {
        logger(`${req.method}  ${req.baseUrl}    ${uuid}     Response: `, {
          requestId: uuid,
          ...res.contentBody,
        })
      }
    })
    next()
  }

module.exports = { requestLoggerMiddleware }
