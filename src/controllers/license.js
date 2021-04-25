/**
 * User controller.
 * Contains all the business logic executed after
 * hitting any user endpoint in routes.
 */

"use strict";

const ApiError = require("../errors/api");
const { getApiClient } = require('../services/request');

const emailService = require('../services/email');
const noteService = require('../services/note');
const licenseService = require('../services/license');
const contactService = require('../services/contact');
const { checkToken, checkTokenSlash } = require('../services/token');

/**
 * Function: Extend License base on contact_cf_extension_period in the body
 * @param {*} req Request
 * @param {*} res Response
 * @param {*} next Next
 * @returns Promise
 */
async function extendLicense(req, res, next) {
  // Middleware: Check token beforehand
  const isAuthenticated = await checkToken(req.headers.token);
  if (!isAuthenticated) {
    return res.status(400).send({
      status: 400,
      message: 'token invalid or missing'
    });
  }

  try {
    const license = await licenseService.extend(req.body);
    const description = `License has been extended by ${req.body.contact_cf_extension_period} days`;
    const createNotesResponse = await noteService.create(req.body.contact_id, description);
    await sendLicenseExtensionEmail(req.body, `Your license has been extended by ${req.body.contact_cf_extension_period} days.`);

    return res.status(200).send({
      status: 200,
      data: {
        message: `license extended successfully for the contact: ${req.body.contact_id}`,
      }
    });
  } catch (error) {
    console.log(`> error while extending license for: ${req.body.contact_id}: ${error}`);
    return res.status(error.status).send(error.toJSON());
  }
}

/**
 * Function: Extend License base on contact_cf_extension_period in the body
 * @param {*} req Request
 * @param {*} res Response
 * @param {*} next Next
 * @returns Promise
 */
async function extendLicenseSlack(req, res, next) {
  const isAuthenticated = await checkTokenSlash(req.body.token);
  if (!isAuthenticated) {
    return res.status(400).send({
      status: 400,
      message: 'token invalid or missing'
    });
  }
  const payloadParams = req.body.text.split("/");

  if (typeof payloadParams[3] === 'undefined' || payloadParams[3] === '') {
    return res.json({
      "response_type": "in_channel", // public to the channel
      "text": "Email is invalid, please follow this example (periods 0-36 months, Zero is default to 14 days):\n`/license Customer Name/Company/Periods/Email`"
    });
  } else {
    const apiClient = await getApiClient(req.body.response_url);
    req.body.contact_email = payloadParams[3];
    req.body.contact_cf_extension_period = parseInt(payloadParams[2]);
    let licensePeriods = 14;
    if (req.body.contact_cf_extension_period > 0) {
      var today = new Date();
      var newDate = new Date();
      newDate.setMonth(today.getMonth() + req.body.contact_cf_extension_period);
      licensePeriods = (newDate - today)/ (1000 * 60 * 60 * 24);
    }
    res.json({
      "response_type": "in_channel", // public to the channel
      "text": `Extending license for ${payloadParams[3]} duration: ${licensePeriods} days`
    });
    const contact = await contactService.getContactIfAlreadyPresent(req.body.contact_email);
    if (contact != null) {
      req.body.contact_cf_license_key = contact.custom_field.cf_license_key;
      req.body.contact_cf_extension_period = licensePeriods;
      req.body.contact_id = contact.id;
      req.body.contact_email = contact.email;
      const extendedLicense = await licenseService.extend(req.body);
      if (extendedLicense.result == 0) {
        const description = `License has been extended by ${req.body.contact_cf_extension_period} days`;
        const createNotesResponse = await noteService.create(req.body.contact_id, description);
        // await sendLicenseExtensionEmail(req.body, `Your license has been extended by ${req.body.contact_cf_extension_period} days.`);
        return await apiClient.request({
          method: 'POST',
          data: {
            "response_type": "in_channel", // public to the channel
            text: `License extended.\nLicense Key: ${contact.custom_field.cf_license_key}`
          }
        });
      } else {
        return await apiClient.request({
          method: 'POST',
          data: {
            "response_type": "in_channel", // public to the channel
            text: `Error while extending the license.`
          }
        });
      }
    } else {
      return await apiClient.request({
        method: 'POST',
        data: {
          "response_type": "in_channel", // public to the channel
          text: `Error: Cannot find customer related to email ${req.body.contact_email}.`
        }
      });
    }
  }
}
/**
 * Protected Function: Send the license email after extended
 * @param {*} body Body
 * @param {*} text Text
 * @returns Promise
 */
async function sendLicenseExtensionEmail(body, text) {
  try {
    // collate all the data. pass it to general email service send.

    const contactId = body.contact_id;
    const html = `<p>${text}</p>`;
    const extraInfo = {
      "v:contactId": contactId,
      html
    };

    const to = body.contact_email || "railflowio@yopmail.com";
    const emailData = await emailService.sendEmail(to, text, extraInfo);
    return emailData;
  } catch (error) {
    console.log(`> error: ${error}`);
    throw new ApiError(`There was some issue sending email to: ${body.contact_id}`);
  }
}

module.exports = {
  extendLicense,
  extendLicenseSlack
};
