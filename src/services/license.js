'use strict';

const appConfigs = require('../../configs/app');
const configs = appConfigs.getConfigs(process.env.APP_ENV || "development");
const ApiError = require("../errors/api");

const qs = require('qs');

async function getCryptolensToken(body) {
    try {
        // const apiClient = await getApiClient(configs.CRYPTOLENS_BASE_URLL);
        // const response = await apiClient.request({
        //     method: 'POST',
        //     url: '/api/key/CreateKey',
        //     headers: {
        //         // TODO: use environment variable
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //     },
        //     data: qs.stringify({
        //         token: configs.CRYPTOLENS_API_KEY,
        //         ProductId: 8245,
        //         Period: 14,
        //         F1: true,
        //         F2: true,
        //         NewCustomer: true,
        //         Name: body.contact_first_name,
        //         Email: body.contact_email,
        //         CompanyName: ""
        //     }),
        // });

        // console.log(`> generated the cryptolens token`);

        // return response.data;

        return Promise.resolve({
            key: 'yo this is the key'
        });
    } catch (error) {
        throw new ApiError(`Error while getting cryptolens token`);
        return;
    }
}

module.exports = {
    getCryptolensToken
}