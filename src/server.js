"use strict";

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const contactRouter = require("./routes/contact");
const signupRouter = require("./routes/signup");
const licenseRouter = require("./routes/license");
const eventRouter = require("./routes/event");
const opportunityRouter = require("./routes/opportunity");

const appConfig = require('../configs/app');
const config = appConfig.getConfigs(process.env.APP_ENV || "development");

class Server {
  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  config() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    const corsOptions = {
      origin: config.ALLOWED_DOMAINS,
      credentials: true,
      optionsSuccessStatus: 200,
      allowedHeaders: "*",
    };
    this.app.use(cors(corsOptions));
  }

  routes() {
    this.app.use("/api/contact", contactRouter);
    this.app.use("/api/signup", signupRouter);
    this.app.use("/api/license", licenseRouter);
    this.app.use("/api/event", eventRouter);
    this.app.use("/api/opportunity", opportunityRouter);

    this.app.use((err, req, res, next) => {
      if (res.headersSent) {
        return next();
      }

      // if (err) {
      //   const response = err.toJSON();
      //   return res.status(err.status).send(response);
      // }
    });
  }

}

module.exports = new Server().app;
