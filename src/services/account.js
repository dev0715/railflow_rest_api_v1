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
const BadRequestError = require("../errors/badrequest");

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
        return response.data.sales_account;
    } catch (error) {
        if (error.response.data.errors.code === 400) {
            throw new BadRequestError(`Account with given company name already exists.`);
        }
        throw new ApiError(`Error while creating the account: ${error.response.data.errors.message[0]}`);
    }
}

async function getAccountIfAlreadyPresent(name) {
    const apiClient = await getApiClient(configs.FRESHSALES_BASE_URL);
    const response = await apiClient.request({
        method: 'GET',
        url: '/crm/sales/api/sales_accounts/filters',
        headers: {
            // TODO: use environment variable
            // Authorization: `Token token=${process.env.FRESHSALES_API_KEY}`,
            Authorization: `Token token=${configs.FRESHSALES_API_KEY}`,
        },
    });

    if (response && response.status === 200) {
        const filters = response.data.filters;
        let viewId;
        for (let f of filters) {
            if (f.name === "All Accounts") {
                viewId = f.id;
            }
        }

        const allAccounts = await getAllAccountsFromView(viewId);

        if (allAccounts != null) {
            for (let a of allAccounts) {
                if (a.name === name) {
                    return a;
                }
            }
        }
    }

    return null;
}


async function getAllAccountsFromView(viewId) {
    const apiClient = await getApiClient(configs.FRESHSALES_BASE_URL);
    const response = await apiClient.request({
        method: 'GET',
        url: `/crm/sales/api/sales_accounts/view/${viewId}`,
        headers: {
            // TODO: use environment variable
            // Authorization: `Token token=${process.env.FRESHSALES_API_KEY}`,
            Authorization: `Token token=${configs.FRESHSALES_API_KEY}`,
        },
    });

    if (response && response.status === 200) {
        return response.data.sales_accounts;
    }

    return null;
}

module.exports = {
    create,
    getAccountIfAlreadyPresent,
};
