/**
 * Token Service.
 * A middleware to check the token before taking any further action
 */

 "use strict";
 const appConfig = require('../../configs/app');
 const configs = appConfig.getConfigs(process.env.APP_ENV);

/**
 * Service: Check token
 * @param {String} token Input token
 * @returns true: matched | false: unmatched
 */
 async function checkToken(token) {
     if (typeof token == 'undefined') {
         return false;
     }
     return (token === configs.ALLOWED_PARTY_SECRET);
 }

 module.exports = {
     checkToken
 };