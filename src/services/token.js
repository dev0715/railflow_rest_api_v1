/**
 * Token Service.
 * A middleware to check the token before taking any further action
 */

"use strict";
const appConfig = require("../../configs/app");
const configs = appConfig.getConfigs();

/**
 * Service: Check token
 * @param {String} token Input token
 * @returns true: matched | false: unmatched
 */
async function checkToken(token) {
  if (configs.ALLOWED_PARTY_SECRET == "ALL") {
    return true;
  }
  if (typeof token == "undefined") {
    return false;
  }
  return token === configs.ALLOWED_PARTY_SECRET;
}
/**
 * Service: Check token for Slack Slash Command
 * @param {String} token Input token
 * @returns true: matched | false: unmatched
 */
async function checkTokenSlash(token) {
  if (typeof token == "undefined") {
    return false;
  }
  return token === configs.SLACK_SLASH_COMMAND_TOKEN;
}

module.exports = {
  checkToken,
  checkTokenSlash,
};
