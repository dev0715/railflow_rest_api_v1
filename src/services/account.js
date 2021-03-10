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
async function updateHiveageHash(account_id,hash) {
    try {
        const apiClient = await getApiClient(configs.FRESHSALES_BASE_URL);
        const response = await apiClient.request({
            method: 'PUT',
            url: `/crm/sales/api/sales_accounts/${account_id}`,
            headers: {
                // TODO: use environment variable
                // Authorization: `Token token=${process.env.FRESHSALES_API_KEY}`,
                Authorization: `Token token=${configs.FRESHSALES_API_KEY}`,
            },
            data: {
                sales_account: { custom_field: {cf_hiveage_hash:hash} }
            },
        });

        console.log(`> hiveage hash added to account`);
        return response.data.sales_account;
    } catch (error) {
        throw new ApiError(`Error while updating hiveage hash: ${error.response.data.errors.message[0]}`);
    }
}
async function getAccountById(account_id) {
    const apiClient = await getApiClient(configs.FRESHSALES_BASE_URL);
    try {
        const response = await apiClient.request({
            method: 'GET',
            url: `/crm/sales/api/sales_accounts/${account_id}`,
            headers: {
                // TODO: use environment variable
                // Authorization: `Token token=${process.env.FRESHSALES_API_KEY}`,
                Authorization: `Token token=${configs.FRESHSALES_API_KEY}`,
            },
        });
        if (response && response.status === 200) {
            return response.data.sales_account;
        }
    } catch (error) {
        if (error.response.status == 404) {
          return false;
        }
        console.log('error when query contact info from freshworks.com');
        return false;
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

async function createHiveageNetwork(network) {
    try {
        const apiClient = await getApiClient(configs.HIVEAGE_BASE_URL);
        const response = await apiClient.request({
            method: 'POST',
            url: '/api/network',
            headers: {
                // TODO: use environment variable
                'Content-Type': 'application/json',
            },
            data: network,
            auth: {
                username: configs.HIVEAGE_API_KEY,
                password: ''
            }
        });
        console.log(`> estimate created successfully`);
        return response.data.network;
    } catch (error) {
        console.log('error when create hiveage network');
        return false;
    }
}async function updateHiveageNetwork(hash_key,network) {
    try {
        const apiClient = await getApiClient(configs.HIVEAGE_BASE_URL);
        const response = await apiClient.request({
            method: 'PUT',
            url: `/api/network/${hash_key}`,
            headers: {
                // TODO: use environment variable
                'Content-Type': 'application/json',
            },
            data: network,
            auth: {
                username: configs.HIVEAGE_API_KEY,
                password: ''
            }
        });
        console.log(`> estimate updated successfully`);
        return response.data.network;
    } catch (error) {
        console.log('error when update hiveage network');
        return false;
    }
}
async function getHiveageNetwork(hash) {
    const apiClient = await getApiClient(configs.HIVEAGE_BASE_URL);
    try {
        const response = await apiClient.request({
            method: 'GET',
            url: `/api/network/${hash}`,
            headers: {
                // TODO: use environment variable
                'Content-Type': 'application/json',
            },
            auth: {
                username: configs.HIVEAGE_API_KEY,
                password: ''
            }
        });
        // const response = await HiveageAPI.retriveConnection(hash)
        console.log(`> estimate retrieved successfully`);
        return response.data.network;
    } catch (error) {
        console.log('error when retrive estimate');
        return false;
    }
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
    getAccountById,
    createHiveageNetwork,
    updateHiveageNetwork,
    getHiveageNetwork,
    updateHiveageHash
};
