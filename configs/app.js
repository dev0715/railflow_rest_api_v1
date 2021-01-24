"use strict";

const dotenv = require("dotenv");
dotenv.config();

const {
  APP_PORT,
  ALLOWED_DOMAINS,
} = process.env;

const configs = {
    development: {
        // hard code these in this object
        APP_PORT: 9000,
        FRESHSALES_API_KEY: "fPjGQStTY1ffGqtyAj9RVw",
        FRESHSALES_BASE_URL: "https://railflow.myfreshworks.com",
        ALLOWED_DOMAINS: "*",
    },
    prod: {
        // set the node_env as `prod`. values
        FRESHSALES_KEY: process.env.FRESHSALES_KEY,
    },
};

const getConfigs = (env) => {
    if (!env) {
        env = "development";
    }
    return configs[env];
}

module.exports = {
    getConfigs
};
