"use strict";

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const morgan = require("morgan");

// routes
const contactRouter = require("./routes/contact");
const signupRouter = require("./routes/signup");
const licenseRouter = require("./routes/license");
const eventRouter = require("./routes/event");
const invoiceRouter = require("./routes/invoice");
const quoteRouter = require("./routes/quote");
const pricingRouter = require("./routes/pricing");
const accountRouter = require("./routes/account");
const hiveageRouter = require("./routes/hiveage");
const beatsRouter = require("./routes/beats");

// swagger file
const swaggerFile = require("../swagger.json");

// config
const appConfig = require("../configs/app");

const config = appConfig.getConfigs();

class Server {
  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
    this.app.use(morgan("dev"));
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
    this.app.use("/api/account", accountRouter);
    this.app.use("/api/contact", contactRouter);
    this.app.use("/api/verify", signupRouter);
    this.app.use("/api/license", licenseRouter);
    this.app.use("/api/event", eventRouter);
    this.app.use("/api/invoice", invoiceRouter);
    this.app.use("/api/quote", quoteRouter);
    this.app.use("/api/pricing", pricingRouter);
    this.app.use("/api/hiveage", hiveageRouter);
    this.app.use("/api/beats", beatsRouter);

    this.app.use((err, req, res, next) => {
      if (res.headersSent) {
        return next();
      }
    });
  }
}

module.exports = new Server().app;
