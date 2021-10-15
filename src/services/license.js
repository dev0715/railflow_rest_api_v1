"use strict";

const appConfigs = require("../../configs/app");
const configs = appConfigs.getConfigs();
const ApiError = require("../errors/api");

const { getApiClient } = require("../services/request");

const BadRequestError = require("../errors/badrequest");

const qs = require("qs");
const logger = require("../config/logger");

/**
 * Service: Get new license
 * @param {*} body Input data
 * @returns Promise
 */
async function getCryptolensToken(body, periods = configs.EXTENSION_PERIOD) {
  try {
    const apiClient = await getApiClient(configs.CRYPTOLENS_BASE_URL);
    const response = await apiClient.request({
      method: "POST",
      url: "/api/key/CreateKey",
      headers: {
        // TODO: use environment variable
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify({
        token: configs.CRYPTOLENS_API_KEY,
        ProductId: configs.PRODUCT_ID,
        Period: periods,
        F1: true,
        F2: true,
        NewCustomer: true,
        Name: `${body.contact_first_name} ${body.contact_last_name}`,
        Email: body.contact_email,
        CompanyName: body.contact_cf_company,
      }),
    });

    logger.info(
      `generated the cryptolens token: ${JSON.stringify(response.data)} for: ${
        body.contact_email
      } duration: ${periods} days`
    );
    return response.data;
  } catch (error) {
    logger.error(`> error generating token: ${error}`);
    throw new ApiError(`Error while getting cryptolens token`);
  }
}

/**
 * Service: Extend a license
 * @param {*} data Input data including key and extension period
 * @returns Promise
 */
async function extend(data) {
  try {
    if (data.contact_cf_license_key == null || data.contact_cf_extension_period == null) {
      throw new BadRequestError(`Please provide the license key and duration in the webhook`);
    }
    const apiClient = await getApiClient(configs.CRYPTOLENS_BASE_URL);
    const response = await apiClient.request({
      method: "POST",
      url: "/api/key/ExtendLicense",
      headers: {
        // TODO: use environment variable
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify({
        token: configs.CRYPTOLENS_LICENSE_EXTENSION_KEY,
        ProductId: configs.PRODUCT_ID,
        NoOfDays: data.contact_cf_extension_period || configs.EXTENSION_PERIOD,
        Key: data.contact_cf_license_key,
      }),
    });

    if (response.data.result === 0) {
      logger.info(`License extended for: ${data.contact_id}`);
      return response.data;
    }
  } catch (error) {
    logger.error(error);
    throw new ApiError(`There was some error in extending the license`);
  }
}

module.exports = {
  extend,
  getCryptolensToken,
};
