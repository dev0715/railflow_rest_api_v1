"use strict";

const http = require("http");
const Server = require("./server");

const logger = require("./config/logger");

const appConfig = require("../configs/app");
const config = appConfig.getConfigs();
const APP_PORT = config.APP_PORT;

const server = http.createServer(Server);

server.listen(APP_PORT);

server.on("listening", onListening);
server.on("error", onError);

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  logger.info(`Listening on ${bind}`);
}

function onError(err) {
  logger.error(`Error: ${err}`);
  process.exit(1);
}

module.exports = server;
