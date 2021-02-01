/**
 * User controller.
 * Contains all the business logic executed after
 * hitting any user endpoint in routes.
 */

"use strict";

const dayjs = require('dayjs');

const ApiError = require("../errors/api");
const UnprocessableRequestError = require("../errors/unprocessablerequest");
// const BadRequestError = require("../errors/badrequest");

const contactService = require('../services/contact');
const accountService = require('../services/account');
const emailService = require('../services/email');
const noteService = require('../services/note');
const taskService = require('../services/task');
const licenseService = require('../services/license');

async function extendLicense(req, res, next) {
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
        console.log(`> error: ${error}`);
        return res.status(error.status).send(error.toJSON());
    }
}

async function sendLicenseExtensionEmail(body, text) {
    try {
        // collate all the data. pass it to general email service send.
        const to = body.contact_email ||  "hellosumedhdev@gmail.com";
        const emailData = await emailService.sendEmail(to, text);
        return emailData;
    } catch (error) {
        console.log(`> error: ${error}`);
        throw new ApiError(`There was some issue sending email to: ${body.contact_id}`);
    }
}

module.exports = {
    extendLicense,
};
