'use strict';

const appConfig = require('../../configs/app');
const configs = appConfig.getConfigs(process.env.APP_ENV);
const { getApiClient } = require('../services/request');

/**
 * Send a slack message used in the new signup
 * @param {*} data message info
 * @returns Promise
 */
async function sendMessage(data) {
    try {
        const apiClient = await getApiClient(configs.SLACK_API_BASE_URL);
        await apiClient.request({
          method: 'POST',
          data: {
            text: `New Signup: <https://railflow.myfreshworks.com/crm/sales/contacts/${data.contactId}|${data.company}> :partying_face:`,
          },
        });

        return Promise.resolve();
      } catch (error) {
        console.log(error);
        throw new ApiError(`> Error while sending slack message`);
      }
}

/**
 * Send a slack message that can be used wisely
 * @param {*} message Message content
 * @returns Promoise
 */
async function sendSlackMessage(message) {
    try {
        const apiClient = await getApiClient(configs.SLACK_API_BASE_URL);
        await apiClient.request({
          method: 'POST',
          data: {
            text: message,
          },
        });

        return Promise.resolve();
      } catch (error) {
        console.log(error);
        throw new ApiError(`> Error while sending slack message`);
      }
}

module.exports = {
    sendMessage,
    sendSlackMessage
};