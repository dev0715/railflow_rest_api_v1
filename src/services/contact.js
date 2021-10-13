/**
 * User controller.
 * Contains all the business logic executed after
 * hitting any user endpoint in routes.
 */

"use strict";

const { createAccount } = require("../services/account");
const { getApiClient } = require("../services/request");

const appConfigs = require("../../configs/app");
const configs = appConfigs.getConfigs(process.env.APP_ENV || "development");

const ApiError = require("../errors/api");
const logger = require("../config/logger");

/**
 * Service: create new contact
 * @param {*} data Contact data
 * @returns Promise
 */
async function create(data) {
  try {
    const apiClient = await getApiClient(configs.FRESHSALES_BASE_URL);
    const response = await apiClient.request({
      method: "POST",
      url: "/crm/sales/api/contacts",
      headers: {
        // TODO: use environment variable
        // Authorization: `Token token=${process.env.FRESHSALES_API_KEY}`,
        Authorization: `Token token=${configs.FRESHSALES_API_KEY}`,
      },
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        mobile_number: data.phone,
        job_title: data.jobTitle,
        custom_field: {
          cf_company: data.company,
          cf_account_id: data.account_id,
          cf_extension_period: 14, // setting this 14 as default. sales agent can change this number before firing license extension webhook.
          cf_license_status: "not_sent", // default is not sent -> after patch -> update to sent
          cf_test_data: data.cf_test_data ? data.cf_test_data : undefined,
        },
        sales_accounts: data.sales_accounts,
      },
    });
    logger.info(
      `Contact created with email: ${data.email}, phone ${data.phone} and name ${data.firstName} ${data.lastName} `
    );
    console.log(response.data);
    return response;
  } catch (error) {
    console.log(error.response.data);
    if (error.response?.data?.errors?.message[0] === "The mobile number already exists.") {
      throw new ApiError("BAD_REQUEST_MOBILE_NUMBER_EXISTS");
    }
    throw new ApiError(
      `Error while creating contact: email: ${data.email} and phone: ${data.work_number}`
    );
  }
}

/**
 * Service: Update a contact by contact_id in the body
 * @param {*} data Contact data
 * @returns Promise
 */
async function update(data) {
  try {
    const apiClient = await getApiClient(configs.FRESHSALES_BASE_URL);
    const response = await apiClient.request({
      method: "PUT",
      url: `/crm/sales/api/contacts/${data.contact_id}`,
      headers: {
        // TODO: use environment variable
        Authorization: `Token token=${configs.FRESHSALES_API_KEY}`,
        "Content-Type": "application/json",
      },
      data: {
        contact: {
          id: data.contact_id,
          contact_status_id: 16000052147,
          custom_field: {
            cf_license_key: data.cf_license_key,
            cf_license_key_url: data.cf_license_key_url,
            cf_license_status: "sent",
          },
        },
      },
    });

    if (!response.data || !response.data.contact)
      throw new ApiError(`Error while updating the contact: ${data.contact_id}`);
    logger.info(`contact status updated successfully for id: ${data.contact_id}`);
    return response.data.contact;
  } catch (error) {
    throw new ApiError(`Error while updating the contact: ${error}`);
  }
}

/**
 * Service: Get contact by ID
 * @param {*} contact_id The contact ID
 * @returns Promise
 */
async function getContactById(contact_id) {
  const apiClient = await getApiClient(configs.FRESHSALES_BASE_URL);
  try {
    const response = await apiClient.request({
      method: "GET",
      url: `/crm/sales/api/contacts/${contact_id}`,
      headers: {
        // TODO: use environment variable
        // Authorization: `Token token=${process.env.FRESHSALES_API_KEY}`,
        Authorization: `Token token=${configs.FRESHSALES_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
    if (response && response.status === 200) {
      return response.data.contact;
    }
  } catch (error) {
    if (error.response.status == 404) {
      return false;
    }
    logger.error("error when query contact info from freshworks.com");
    return false;
  }
}

/**
 * Service: Get contact by email
 * @param {*} email Contact email
 * @returns Promise
 */
async function getContactIfAlreadyPresent(email) {
  const apiClient = await getApiClient(configs.FRESHSALES_BASE_URL);
  const response = await apiClient.request({
    method: "GET",
    //url: '/crm/sales/api/contacts/filters',
    url: "/crm/sales/api/lookup?q=" + email + "&entities=contact&f=email",
    headers: {
      // TODO: use environment variable
      // Authorization: `Token token=${process.env.FRESHSALES_API_KEY}`,
      Authorization: `Token token=${configs.FRESHSALES_API_KEY}`,
    },
  });
  const alreadyPresent = response.data.contacts.contacts;

  if (alreadyPresent.length == 0) return null;
  return alreadyPresent[0];
}

/**
 * Service: Get all contact by view (use in filter)
 * @param {*} viewId Filter view id
 * @returns Promise
 */
async function getAllContactsFromView(viewId) {
  const apiClient = await getApiClient(configs.FRESHSALES_BASE_URL);
  const response = await apiClient.request({
    method: "GET",
    url: `/crm/sales/api/contacts/view/${viewId}`,
    headers: {
      // TODO: use environment variable
      // Authorization: `Token token=${process.env.FRESHSALES_API_KEY}`,
      Authorization: `Token token=${configs.FRESHSALES_API_KEY}`,
    },
  });

  if (response && response.status === 200) {
    return response.data.contacts;
  }

  return null;
}

/**
 * Service: Bulk Delete Contacts by ids
 * @param {*} contact_ids array of contact ids
 * @returns Promise
 */
async function bulkDelete(ids) {
  try {
    const apiClient = await getApiClient(configs.FRESHSALES_BASE_URL);
    const response = await apiClient.request({
      method: "POST",
      url: `/crm/sales/api/contacts/bulk_destroy`,
      headers: {
        // TODO: use environment variable
        Authorization: `Token token=${configs.FRESHSALES_API_KEY}`,
        "Content-Type": "application/json",
      },
      data: {
        selected_ids: ids,
      },
    });

    logger.info(response.data);
    return response.data;
  } catch (error) {
    throw new ApiError(`> Error while bulkDelete contacts by ids: ${error}`);
  }
}
/**
 * Service: Search for Contact
 * @param email user email
 * @returns Promise
 */
async function search(email) {
  try {
    const apiClient = await getApiClient(configs.FRESHSALES_BASE_URL);
    const response = await apiClient.request({
      method: "GET",
      url: `crm/sales/api/lookup?q=${email}&entities=contact&f=email`,
      headers: {
        Authorization: `Token token=${configs.FRESHSALES_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw new ApiError(`> Error while searching the contact: ${error}`);
  }
}

async function searchByPhone(phone) {
  try {
    const apiClient = await getApiClient(configs.FRESHSALES_BASE_URL);
    const response = await apiClient.request({
      method: "GET",
      url: `crm/sales/api/lookup?q=${phone}&entities=contact&f=mobile_number`,
      headers: {
        Authorization: `Token token=${configs.FRESHSALES_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw new ApiError(`> Error while searching the contact: ${error}`);
  }
}

module.exports = {
  create,
  update,
  search,
  getContactIfAlreadyPresent,
  getContactById,
  bulkDelete,
  searchByPhone,
};
