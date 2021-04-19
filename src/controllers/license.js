/**
 * User controller.
 * Contains all the business logic executed after
 * hitting any user endpoint in routes.
 */

"use strict";

const ApiError = require("../errors/api");

const emailService = require('../services/email');
const noteService = require('../services/note');
const licenseService = require('../services/license');
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
      
    // res.json({"text":"`contact_id` ⎵ `contact_name` ⎵ `email`"});
    res.json({resData:req.body});
    return res.status(200).send({
      status: 200,
      message: 'token is valid'
    });
  
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
