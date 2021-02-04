/**
 * User controller.
 * Contains all the business logic executed after
 * hitting any user endpoint in routes.
 */

"use strict";

const { createAccount } = require("../services/account");
const { getApiClient } = require('../services/request');

const appConfigs = require('../../configs/app');
const configs = appConfigs.getConfigs(process.env.APP_ENV || "development");

const ApiError = require("../errors/api");
// const UnprocessableRequestError = require("../errors/unprocessablerequest");
// const BadRequestError = require("../errors/badrequest");

async function create(data) {
  try {
    const apiClient = await getApiClient(configs.FRESHSALES_BASE_URL);
    const response = await apiClient.request({
      method: 'POST',
      url: '/crm/sales/api/contacts',
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
          cf_extension_period: 14, // setting this 14 as default. sales agent can change this number before firing license extension webhook.
        },
        sales_accounts: data.sales_accounts
      },
    });

    console.log(`> contact created: ${data.email} ${response.data.contact.id}`);
    return response;
  } catch (error) {
    console.log(error);
    throw new ApiError(`Error while creating contact`);
  }
}

async function update(data) {
  try {
    const apiClient = await getApiClient(configs.FRESHSALES_BASE_URL);
    const response = await apiClient.request({
      method: 'PUT',
      url: `/crm/sales/api/contacts/${data.contact_id}`,
      headers: {
        // TODO: use environment variable
        Authorization: `Token token=${configs.FRESHSALES_API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        contact: {
          id: data.contact_id,
          contact_status_id: 16000052147,
          custom_field: {
            cf_license_key: data.cf_license_key
          },
        }
      }
    });

    console.log(`> contact status updated successfully for id: ${data.contact_id}`);
    return response.data.contact;
  } catch (error) {
    throw new ApiError(`> Error while updating the contact: ${error}`);
    return;
  }
}

async function checkIfAlreadyPresent(email) {
  console.log(`> checkIfAlreadyPresent: ${email}`);
  const apiClient = await getApiClient(configs.FRESHSALES_BASE_URL);
  const response = await apiClient.request({
    method: 'GET',
    url: '/crm/sales/api/contacts/filters',
    headers: {
      // TODO: use environment variable
      // Authorization: `Token token=${process.env.FRESHSALES_API_KEY}`,
      Authorization: `Token token=${configs.FRESHSALES_API_KEY}`,
    },
  });

  if (response && response.status === 200) {
    console.log(`> checkIfAlreadyPresent:200`);
    const filters = response.data.filters;
    let viewId;
    for (let f of filters) {
      if (f.name === "All Contacts") {
        viewId = f.id;
      }
    }

    const allContacts = await getAllContactsFromView(viewId);

    if (allContacts != null) {
      for (let c of allContacts) {
        if (c.email === email) {
          console.log(`> checkIfAlreadyPresent:true`);
          return true
        }
      }
    }
  }

  console.log(`> checkIfAlreadyPresent:false`);
  return false;
}

async function getAllContactsFromView(viewId) {
  const apiClient = await getApiClient(configs.FRESHSALES_BASE_URL);
  const response = await apiClient.request({
    method: 'GET',
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

module.exports = {
  create,
  update,
  checkIfAlreadyPresent,
};
