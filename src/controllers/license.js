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
    let resData = {
        response_type: "in_channel", // public to the channel
        text: "302: Found",
        attachments: [
          {
            // image_url: "https://http.cat/302.jpg"
          }
        ]
      };
      const vars = req.body.text.split(" ");
      vars.forEach (item => {
        const itemsplited = item.split(":");
        req.body[itemsplited[0]]=itemsplited[1];
      });
    if (typeof req.body.license_key !== 'undefined') {
      req.body.contact_cf_license_key=req.body.license_key;
    } else {
      res.json({"text":"License Key is invalid, please follow this example (⎵ is whitespace): `contact_id:16004191559⎵extension_period:8⎵license_key:ICWUF-JHARN-GEGRI-XDMYN`"});
    }
    if (parseInt(req.body.extension_period)) {
      req.body.contact_cf_extension_period = parseInt(req.body.extension_period);
    }
    else {
      res.json({"text":"Period is invalid, please follow this example (⎵ is whitespace): `contact_id:16004191559⎵extension_period:8⎵license_key:ICWUF-JHARN-GEGRI-XDMYN`"});
    }
    console.log(req.body);
    const apiClient = await getApiClient(req.body.response_url);
    try {
        const contact = await contactService.getContactById(req.body.contact_id)
        // Return HTTP 200 to Slack
        res.json({
          "response_type": "in_channel",
          "text":"Extending the license..."
        });
        const license = await licenseService.extend(req.body);
        const description = `License has been extended by ${req.body.contact_cf_extension_period} days`;
        const createNotesResponse = await noteService.create(req.body.contact_id, description, true);
        req.body.contact_email = contact.email;
        sendLicenseExtensionEmail(req.body, `Your license has been extended by ${req.body.contact_cf_extension_period} days.`);
        await apiClient.request({
            method: 'POST',
            data: {
              replace_original: true,
              text: `Extended the license, updated notes, onboarding email sent.`
            }
        });
        
    } catch (error) {
        console.log(`> error while extending license for: ${req.body.contact_id}: ${error}`);
        return res.status(error.status).send(error.toJSON());
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

        const to = body.contact_email ||  "hellosumedhdev@gmail.com";
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
