'use strict';

const appConfig = require('../../configs/app');
const configs = appConfig.getConfigs(process.env.APP_ENV);
const { getApiClient } = require('../services/request');
const ApiError = require("../errors/api");

/**
 * Service: Update an opportunity follow the request id
 * @param {*} id Opportunity ID to be updated
 * @param {*} data Opportunity Data
 * @returns Promise
 */
async function updateFsOpportunity(id, data) {
    try {
        const apiClient = await getApiClient(configs.FRESHSALES_BASE_URL);
        const response = await apiClient.request({
            method: 'PUT',
            url: `/crm/sales/api/deals/${id}`,
            headers: {
                // TODO: use environment variable
                // Authorization: `Token token=${process.env.FRESHSALES_API_KEY}`,
                Authorization: `Token token=${configs.FRESHSALES_API_KEY}`,
            },
            data: data
        });

        console.log(`> Opportunity updated with name: ${response.data.deal.name}`);
        return response.data.deal;
    } catch (error) {
        throw new ApiError(`Error while updating the opportunity: ${error.response.data.errors.message[0]}`);
    }
}

/**
 * Service: Create a new Opportunity and assign to correct column
 * @param {*} data Opportunity Data
 * @returns Promise
 */
async function createFsOpportunity(data) {
    try {
        const apiClient = await getApiClient(configs.FRESHSALES_BASE_URL);
        const response = await apiClient.request({
            method: 'POST',
            url: '/crm/sales/api/deals',
            headers: {
                // TODO: use environment variable
                // Authorization: `Token token=${process.env.FRESHSALES_API_KEY}`,
                Authorization: `Token token=${configs.FRESHSALES_API_KEY}`,
            },
            data: data
        });

        console.log(`> Opportunity created with name: ${data.deal.name}`);
        return response.data.deal;
    } catch (error) {
        if (error.response.data.errors.code === 400) {
            throw new BadRequestError(`Opportunity with given info already exists.`);
        }
        throw new ApiError(`Error while creating the opportunity: ${error.response.data.errors.message[0]}`);
    }
}

/**
 * Service: Get an opportunity by input ID
 * @param {*} id Opportunity ID
 * @returns Promise
 */
async function getFsOpportunity(id) {
    try {
        const apiClient = await getApiClient(configs.FRESHSALES_BASE_URL);
        const response = await apiClient.request({
            method: 'GET',
            url: `/crm/sales/api/deals/${id}`,
            headers: {
                // TODO: use environment variable
                // Authorization: `Token token=${process.env.FRESHSALES_API_KEY}`,
                Authorization: `Token token=${configs.FRESHSALES_API_KEY}`,
            }
        });

        console.log(`> Opportunity retrived`);
        return response.data.deal;
    } catch (error) {
        return false;
        throw new ApiError(`Error while retriveing the opportunity: ${error.response.data.errors.message[0]}`);
    }
}
module.exports = {
    createFsOpportunity,
    getFsOpportunity,
    updateFsOpportunity
};