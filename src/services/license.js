'use strict';

const appConfigs = require('../../configs/app');
const configs = appConfigs.getConfigs(process.env.APP_ENV || "development");
const ApiError = require("../errors/api");

const { getApiClient } = require('../services/request');

const BadRequestError = require("../errors/badrequest");

const qs = require('qs');

async function getCryptolensToken(body) {
  try {
    const apiClient = await getApiClient(configs.CRYPTOLENS_BASE_URL);
    const response = await apiClient.request({
        method: 'POST',
        url: '/api/key/CreateKey',
        headers: {
            // TODO: use environment variable
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify({
            token: configs.CRYPTOLENS_API_KEY,
            ProductId: 8245,
            Period: 14,
            F1: true,
            F2: true,
            NewCustomer: true,
            Name: body.contact_first_name,
            Email: body.contact_email,
            CompanyName: ""
        }),
    });

    console.log(`> generated the cryptolens token: ${JSON.stringify(response.data)}`);

    return response.data;

    // return Promise.resolve({
    //   key: 'yo this is the key'
    // });
  } catch (error) {
    console.log(`> error generating token: ${error}`);
    throw new ApiError(`Error while getting cryptolens token`);
    return
  }
}

async function extend(data) {
  try {
    if (data.contact_cf_license_key == null || data.contact_cf_extension_period == null) {
      throw new BadRequestError(`Please provide the license key and duration in the webhook`);
    }
    const apiClient = await getApiClient(configs.CRYPTOLENS_BASE_URL);
    const response = await apiClient.request({
      method: 'POST',
      url: '/api/key/ExtendLicense',
      headers: {
        // TODO: use environment variable
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify({
        token: configs.CRYPTOLENS_LICENSE_EXTENSION_KEY,
        ProductId: 8245,
        NoOfDays: data.contact_cf_extension_period || 14,
        Key: data.contact_cf_license_key,
      }),
    });

    console.log(`> response: ${response.data}`);
    if (response.data.result === 0) {
      console.log(`> license extension successful: ${JSON.stringify(response.data)}`);
      return response.data;
    }

    // return Promise.resolve(); // only for testing purposes.

    // throw new ApiError(`> !200 from cryyptolens`);
  } catch (error) {
    throw new ApiError(`There was some error in extending the license`);
  }
}

module.exports = {
  extend,
  getCryptolensToken
}

