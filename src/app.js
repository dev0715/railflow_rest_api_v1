"use strict";

const http = require("http");
const Server = require("./server");

const appConfig = require("../configs/app");
const config = appConfig.getConfigs(process.env.APP_ENV || "development");
const APP_PORT = config.APP_PORT;

const server = http.createServer(Server);

server.listen(APP_PORT);

server.on("listening", onListening);
server.on("error", onError);

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
}

function onError(err) {
  console.log(`Error: ${err}`);
  process.exit(1);
}
