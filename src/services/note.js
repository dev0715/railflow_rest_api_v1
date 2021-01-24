'use strict';

const appConfig = require('../../configs/app');
const configs = appConfig.getConfigs(process.env.APP_ENV);
const { getApiClient } = require('../services/request');
const ApiError = require("../errors/api");

async function create(targetableId, description) {
    try {
        const apiClient = await getApiClient(configs.FRESHSALES_BASE_URL); // put railflow host
        const response = await apiClient.request({
            method: 'POST',
            url: '/crm/sales/api/notes',
            headers: {
                // TODO: use environment variable
                Authorization: `Token token=${configs.FRESHSALES_API_KEY}`, // fPjGQStTY1ffGqtyAj9RVw
                'Content-Type': 'application/json',
            },
            data: {
                note: {
                    description,
                    targetable_type: "Contact",
                    targetable_id: targetableId,
                }
            }
        });

        console.log(`> note created successfully`);
        return response.data;
    } catch (error) {
        throw new ApiError(`Error while creating node for: ${contactId}`);
    }
}

module.exports = {
    create
};