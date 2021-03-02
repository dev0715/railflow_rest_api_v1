/**
 * User controller.
 * Contains all the business logic executed after
 * hitting any user endpoint in routes.
 */

"use strict";

// const ApiError = require("../errors/api");
const UnprocessableRequestError = require("../errors/unprocessablerequest");
// const BadRequestError = require("../errors/badrequest");

const contactService = require('../services/contact');
const accountService = require('../services/account');
const slackService = require('../services/slack');

async function createContact(request, res, next) {
  try {
    const data = {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      phone: request.body.phone,
      jobTitle: request.body.jobTitle,
      company: request.body.company,
    };

    // check if the contact is already there.
    const alreadyPresent = await contactService.getContactIfAlreadyPresent(request.body.email);
    if (alreadyPresent !== null) {
      console.log(`> contact with provided email already present: ${request.body.email}`);
      return res.status(200).send({
        status: 200,
        data: {
          message: `Duplicate Registration`,
          contact: {
            id: alreadyPresent.id,
          },
        },
      });
    }

    let account = await accountService.getAccountIfAlreadyPresent(request.body.company);

    if (!account) {
      account = await accountService.create({ name: request.body.company });
    }

    if (!!account) {
      data.sales_accounts = [{
        id: account.id,
        is_primary: true,
      }];

      const response = await contactService.create(data);
      if (response && response.data && response.data.contact) {
        console.log(`> contact created. sending slack notification: ${response.data.contact.id}`);
        const notificationData = {
          contactId: response.data.contact.id,
          company: request.body.company,
        };

        await slackService.sendMessage(notificationData);
        return res.status(201).send({
          status: 201,
          data: {
            contact: {
              id: response.data.contact.id
            },
          },
        });
      }
    }

    return res.status(500).send({
      status: 500,
      data: {
        message: `Account creation failed with status code: ${resp.status} for: ${req.body.email}`,
      },
    });
  } catch (error) {
    return res.status(error.status).send(error.toJSON());
  }
}

module.exports = {
  createContact,
};
