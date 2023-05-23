"use strict";

const dotenv = require("dotenv");
dotenv.config();

const configs = {
  // hard code these in this object
  
};

const getConfigs = () => {
  return configs;
};

module.exports = {
  getConfigs,
};
