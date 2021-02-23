/**
 * User controller.
 * Contains all the business logic executed after
 * hitting any user endpoint in routes.
 */

"use strict";

const appConfig = require('../../configs/app');
const configs = appConfig.getConfigs(process.env.APP_ENV);
const { getApiClient } = require('./request');

const ApiError = require("../errors/api");

async function create(data) {
    try {
        const apiClient = await getApiClient(configs.FRESHSALES_BASE_URL);
        const response = await apiClient.request({
            method: 'POST',
            url: '/crm/sales/api/sales_accounts',
            headers: {
                // TODO: use environment variable
                // Authorization: `Token token=${process.env.FRESHSALES_API_KEY}`,
                Authorization: `Token token=${configs.FRESHSALES_API_KEY}`,
            },
            data: {
                sales_account: { name: data.name }
            },
        });

        console.log(`> account created with name: ${data.name}`);
        return response;
    } catch (error) {
        throw new ApiError(`Error while creating the account: ${error.response.data.errors.message[0]}`);
    }
}

module.exports = {
    create,
};
