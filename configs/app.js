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
        CRYPTOLENS_BASE_URL: "https://app.cryptolens.io",
        CRYPTOLENS_API_KEY: "WyIyNjQ5MDgiLCIzT3ZBYlNybjRjSll1T0U1OU1jTUlydE5BSW90Ti93YWpod2d3TDVRIl0=",
        MAILGUN_KEY: "key-4c45b28d4cab5d63a74df82c99aae76c",
        HIVEAGE_BASE_URL: "https://railflow.hiveage.com/",
        HIVEAGE_API_KEY: "WYc9h6V-bNthiAsvJN8t"
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
