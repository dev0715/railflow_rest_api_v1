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
      console.log(`> duplicate lead: ${request.body.email}`);
      return res.status(200).send({
        status: 200,
        data: {
          message: `Whoops. It seems that you have already evaluated Railflow. If you would like to evaluate again or would like to extend your license, please go to  and submit a ticket. Someone from our customer success team will help you right away. You can also leave a message in our chat bot and it will also notify the customer success team.`,
          contact: alreadyPresent,
        },
      });
    }

    const resp = await accountService.create({ name: request.body.company });

    if (resp.status == 200) {
      data.sales_accounts = [{
        id: resp.data.sales_account.id,
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
        return res.status(response.status).send({
          status: response.status,
          data: response.data
        });
      }
    }

    return res.status(500).send({
      status: 500,
      data: {
        message: `Something went wrong in signup for: ${req.body.email}`,
      },
    });
  } catch (error) {
    return res.status(error.status).send(error.toJSON());
  }
}

module.exports = {
  createContact,
};
