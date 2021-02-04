'use strict';

const appConfig = require('../../configs/app');
const configs = appConfig.getConfigs(process.env.APP_ENV);

const ApiError = require("../errors/api");
const mailgun = require("mailgun-js");
const { getApiClient } = require('../services/request');

async function createInvoiceClient(data) {
    console.log(`> creating invoice for: ${JSON.stringify(data)}`);
        try {
            const apiClient = await getApiClient(configs.HIVEAGE_BASE_URL);
            const response = await apiClient.request({
                method: 'POST',
                url: '/api/network',
                headers: {
                    // TODO: use environment variable
                    'Content-Type': 'application/json',
                },
                data: data,
                auth: {
                    username: configs.HIVEAGE_API_KEY,
                    password: ''
                }
            });

            console.log(`> invoice client created for: ${data.name} | ${data.business_email}`);
            return response;
        } catch (error) {
            throw new ApiError(`Invoice client creation failed`);
        }
}

module.exports = {
    createInvoiceClient
};