"use strict";

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const contactRouter = require("./routes/contact");
const signupRouter = require("./routes/signup");
const licenseRouter = require("./routes/license");
const eventRouter = require("./routes/event");
const opportunityRouter = require("./routes/opportunity");
const quoteRouter = require("./routes/quote");

const appConfig = require('../configs/app');
const config = appConfig.getConfigs(process.env.APP_ENV || "development");

class Server {
  constructor() {
    const swaggerDefinition = {
      openapi: '3.0.0',
      info: {
        title: 'Express API for Railflow',
        version: '1.0.0',
        description:
          'This is a REST API application made with Express. It retrieves data from Railflow.',
        license: {
          name: 'Licensed Under MIT',
          url: 'https://spdx.org/licenses/MIT.html',
        },
        contact: {
          name: 'Railflow',
          url: 'https://railflow.io',
        },
      },
      servers: [
        {
          url: 'http://localhost:9000',
          description: 'Development server',
        },
        {
          url: 'http://api.railflow.io',
          description: 'Production server',
        },
      ],
    };

    const options = {
      swaggerDefinition,
      // Paths to files containing OpenAPI definitions
      // apis: ['src/routes/*.js'],
      apis: ['src/swagger/*.js','src/routes/*.js']
    };

    const swaggerSpec = swaggerJSDoc(options);
    this.app = express();
    this.config();
    this.routes();
    this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  config() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    // this.app.set('view engine', 'hbs');

    const corsOptions = {
      origin: config.ALLOWED_DOMAINS,
      credentials: true,
      optionsSuccessStatus: 200,
      allowedHeaders: "*",
    };
    this.app.use(cors(corsOptions));
  }

  routes() {
    this.app.use("/api/register", contactRouter);
    this.app.use("/api/verify", signupRouter);
    this.app.use("/api/license", licenseRouter);
    this.app.use("/api/event", eventRouter);
    this.app.use("/api/opportunity", opportunityRouter);
    this.app.use("/api/quote", quoteRouter);

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
