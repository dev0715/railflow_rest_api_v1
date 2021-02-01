"use strict";

const dotenv = require("dotenv");
dotenv.config();

const configs = {
    development: {
        // hard code these in this object
        APP_PORT: 9000,
        FRESHSALES_API_KEY: "fPjGQStTY1ffGqtyAj9RVw",
        FRESHSALES_BASE_URL: "https://railflow.myfreshworks.com",
        ALLOWED_DOMAINS: ["http://localhost:8000", "https://railflow.io"],
        CRYPTOLENS_BASE_URL: "https://app.cryptolens.io",
        CRYPTOLENS_API_KEY: "WyIyNjQ5MDgiLCIzT3ZBYlNybjRjSll1T0U1OU1jTUlydE5BSW90Ti93YWpod2d3TDVRIl0=",
        MAILGUN_KEY: "key-4c45b28d4cab5d63a74df82c99aae76c",
        HIVEAGE_BASE_URL: "https://railflow.hiveage.com/",
        HIVEAGE_API_KEY: "WYc9h6V-bNthiAsvJN8t",
        SLACK_API_BASE_URL: "https://hooks.slack.com/services/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",
        CRYPTOLENS_LICENSE_EXTENSION_KEY: "WyIyODk0MTIiLCIwQUx0TG1LRWxUNXZRZXJLYWJMZzBUY3NLSGJ0akgvaCtkZEx4b3h6Il0=",
    },
    production: {
        // set the node_env as `prod`. values
        APP_PORT: process.env.APP_PORT,
        FRESHSALES_API_KEY: process.env.FRESHSALES_API_KEY,
        FRESHSALES_BASE_URL: process.env.FRESHSALES_BASE_URL,
        ALLOWED_DOMAINS: "*",
        CRYPTOLENS_BASE_URL: process.env.CRYPTOLENS_BASE_URL,
        CRYPTOLENS_API_KEY: process.env.CRYPTOLENS_API_KEY,
        MAILGUN_KEY: process.env.MAILGUN_KEY,
        HIVEAGE_BASE_URL: process.env.HIVEAGE_BASE_URL,
        HIVEAGE_API_KEY: process.env.HIVEAGE_API_KEY,
        SLACK_API_BASE_URL: process.env.SLACK_API_BASE_URL,
        CRYPTOLENS_LICENSE_EXTENSION_KEY: process.env.CRYPTOLENS_LICENSE_EXTENSION_KEY,
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
