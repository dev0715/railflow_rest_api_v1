"use strict";

const dotenv = require("dotenv");
dotenv.config();

const configs = {
  development: {
    // hard code these in this object
    APP_PORT: 9000,
    FRESHSALES_API_KEY: "fPjGQStTY1ffGqtyAj9RVw",
    FRESHSALES_BASE_URL: "https://railflow.myfreshworks.com",
    ALLOWED_DOMAINS: [
      "http://localhost:8000",
      "http://localhost",
      "http://localhost:9000",
      "https://railflow.io",
    ],
    CRYPTOLENS_BASE_URL: "https://app.cryptolens.io",
    CRYPTOLENS_API_KEY: "WyI0NDk1MzMiLCJqdjFYRGJYc0RuVmFHU0NmdFlnUWptMklTcXdVai9lNVRnRklkL3Y3Il0=",
    MAILGUN_KEY: "key-4c45b28d4cab5d63a74df82c99aae76c",
    HIVEAGE_DOMAIN: "railflow",
    HIVEAGE_BASE_URL: "https://railflow.hiveage.com/",
    HIVEAGE_API_KEY: "TQcCm6QAzYgCcgzrNqs7",
    SLACK_API_BASE_URL:
      "https://hooks.slack.com/services/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",
    SLACK_SLASH_COMMAND_TOKEN: "kBWbldLF6g11eDX5rpyRQUY4",
    CRYPTOLENS_LICENSE_EXTENSION_KEY:
      "WyIyODk0MTIiLCIwQUx0TG1LRWxUNXZRZXJLYWJMZzBUY3NLSGJ0akgvaCtkZEx4b3h6Il0=",
    CRYPTOLENS_RSA_PUB_KEY:
      "<RSAKeyValue><Modulus>5TFzvx1Ygenf7BJYxliBFkcKSDebrxVTUteai/xjHP/Tmrx2z5h5vJRkQlg6vxecbLDj7g+TAvZssEVj5D1VVtur2Od1Fdqs49m0dA+QdGBv5DXt9YeqJLW/JpciMom79HcOeIvJDTHJcQssCXKLxGnQkTpMIpB22hTOuJTcj1bmLManR6mQYX2k/BZ/XkC2l61TbKaOnKww3BrX8+b2ImT89VeN0znxIEwBUla78C6pDJTkKDPZPeHItHk9gTBx9CkCCfMdzidVxwiMFvXM7PSBWSFKn2JPO5+gawJbV+0nH95890EL80dl/OH/K5O+CYTaHrKJ+zUcY7MxLqsmCw==</Modulus><Exponent>AQAB</Exponent></RSAKeyValue>",
    ALLOWED_PARTY_SECRET: "ALL",
    GCP_BUCKET_NAME: "railflow-development",
    GOOGLE_CLOUD_BUCKET: "gs://railflow-licenses",
    GOOGLE_CLOUD_BUCKET_PATH: "https://storage.cloud.google.com",
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
    SLACK_SLASH_COMMAND_TOKEN: process.env.SLACK_SLASH_COMMAND_TOKEN,
    CRYPTOLENS_LICENSE_EXTENSION_KEY: process.env.CRYPTOLENS_LICENSE_EXTENSION_KEY,
    CRYPTOLENS_RSA_PUB_KEY: process.env.CRYPTOLENS_RSA_PUB_KEY,
    ALLOWED_PARTY_SECRET: process.env.ALLOWED_PARTY_SECRET,
    GCP_BUCKET_NAME: process.env.GCP_BUCKET_NAME,
    GOOGLE_CLOUD_BUCKET: process.env.GOOGLE_CLOUD_BUCKET,
    GOOGLE_CLOUD_BUCKET_PATH: process.env.GOOGLE_CLOUD_BUCKET_PATH,
  },
  test: {
    // hard code these in this object
    APP_PORT: 9000,
    FRESHSALES_API_KEY: "fPjGQStTY1ffGqtyAj9RVw",
    FRESHSALES_BASE_URL: "https://railflow.myfreshworks.com",
    ALLOWED_DOMAINS: [
      "http://localhost:8000",
      "http://localhost",
      "http://localhost:9000",
      "https://railflow.io",
    ],
    CRYPTOLENS_BASE_URL: "https://app.cryptolens.io",
    CRYPTOLENS_API_KEY: "WyI0NDk1MzMiLCJqdjFYRGJYc0RuVmFHU0NmdFlnUWptMklTcXdVai9lNVRnRklkL3Y3Il0=",
    MAILGUN_KEY: "key-4c45b28d4cab5d63a74df82c99aae76c",
    HIVEAGE_DOMAIN: "railflow",
    HIVEAGE_BASE_URL: "https://railflow.hiveage.com/",
    HIVEAGE_API_KEY: "TQcCm6QAzYgCcgzrNqs7",
    SLACK_API_BASE_URL:
      "https://hooks.slack.com/services/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",
    SLACK_SLASH_COMMAND_TOKEN: "kBWbldLF6g11eDX5rpyRQUY4",
    CRYPTOLENS_LICENSE_EXTENSION_KEY:
      "WyIyODk0MTIiLCIwQUx0TG1LRWxUNXZRZXJLYWJMZzBUY3NLSGJ0akgvaCtkZEx4b3h6Il0=",
    CRYPTOLENS_RSA_PUB_KEY:
      "<RSAKeyValue><Modulus>5TFzvx1Ygenf7BJYxliBFkcKSDebrxVTUteai/xjHP/Tmrx2z5h5vJRkQlg6vxecbLDj7g+TAvZssEVj5D1VVtur2Od1Fdqs49m0dA+QdGBv5DXt9YeqJLW/JpciMom79HcOeIvJDTHJcQssCXKLxGnQkTpMIpB22hTOuJTcj1bmLManR6mQYX2k/BZ/XkC2l61TbKaOnKww3BrX8+b2ImT89VeN0znxIEwBUla78C6pDJTkKDPZPeHItHk9gTBx9CkCCfMdzidVxwiMFvXM7PSBWSFKn2JPO5+gawJbV+0nH95890EL80dl/OH/K5O+CYTaHrKJ+zUcY7MxLqsmCw==</Modulus><Exponent>AQAB</Exponent></RSAKeyValue>",
    ALLOWED_PARTY_SECRET: "ALL",
    GCP_BUCKET_NAME: "railflow-test",
    GOOGLE_CLOUD_BUCKET: "gs://railflow-licenses",
    GOOGLE_CLOUD_BUCKET_PATH: "https://storage.cloud.google.com",
  },
};

const getConfigs = (env) => {
  if (!env) {
    env = "development";
  }
  return configs[env];
};

module.exports = {
  getConfigs,
};
