/**
 * User controller.
 * Contains all the business logic executed after
 * hitting any user endpoint in routes.
 */

"use strict";

const dayjs = require('dayjs');

// const ApiError = require("../errors/api");
const UnprocessableRequestError = require("../errors/unprocessablerequest");
// const BadRequestError = require("../errors/badrequest");

const contactService = require('../services/contact');
const accountService = require('../services/account');
const emailService = require('../services/email');
const noteService = require('../services/note');
const taskService = require('../services/task');
const licenseService = require('../services/license');

async function createLead(req, res, next) {
  try {

    // 1. get token
    // 2. send email
    // 3. update contact status
    // 4. create two follow up tasks with reminder 5 and 10 days.
    // add a note to the contact mentionining the details of token, email etc

    // console.log(`> headers: ${request.headers}`);

    // return getCryptolensToken(this.httpService, request.body)
    //     .then((cryptolensTokenObject) => sendOnboardingEmail({ text: getCryptolensTokenEmailContent(cryptolensTokenObject), cryptolensTokenObject: cryptolensTokenObject, body: request.body }))
    //     .then((mailgunResponse) => {
    //         request.body.cf_license_key = mailgunResponse.key;
    //         const description = `Cryptolens key: ${mailgunResponse.key} \n\n Email sent at: ${dayjs()} \n\n Mailgun Id: ${mailgunResponse.id} \n\n Key type: New`;
    //         return this.noteService.createNote(this.httpService, request.body.contact_id, description)
    //     })
    //     .then(() => createTask(this.httpService, request))
    //     .then(() => updateContact(this.httpService, request))
    //     .then(() => reply.status(200).send({ success: true }))
    //     .catch((err) => {
    //         console.log(`err: ${err}`);
    //         return reply.status(500).send({ success: false, message: "Something went wrong on our end" })
    //     })


    const cryptolensTokenObject = await licenseService.getCryptolensToken(req.body);
    const mailgunResponse = await sendOnboardingEmail(req.body, cryptolensTokenObject);
    const description = `Cryptolens key: ${cryptolensTokenObject.key} \n\n Email sent at: ${dayjs()} \n\n Mailgun Id: ${mailgunResponse.id} \n\n Key type: New`;
    const createNotesResponse = await noteService.create(req.body.contact_id, description);
    const createTaskResponse = await taskService.create({contact_id: req.body.contact_id});
    const contact = await contactService.update(req.body);

    return res.status(200).send({
        status: 200,
        data: {
            message: "lead created successfully",
            contact,
        }
    });
  } catch (error) {
    return res.status(error.status).send(error.toJSON());
  }
}

function getCryptolensTokenEmailContent(cryptolensTokenObject) {
    console.log(`> converting token to email text`);
    return `Customer Id: ${cryptolensTokenObject.customerId} | Token: ${cryptolensTokenObject.key}`
}

async function sendOnboardingEmail(body, cryptolensTokenObject) {
    try {
        // collate all the data. pass it to general email service send.
        const text = getCryptolensTokenEmailContent(cryptolensTokenObject);
        const contactId = body.contact_id;

        const extraInfo = {
            "v:contactId": contactId
        };

        const to = body.email || "hellosumedhdev@gmail.com";

        const emailData = await emailService.sendEmail(to, text, extraInfo);
        return emailData;
    } catch (error) {
        throw new ApiError(`There was some issue sending email to: ${info.body.contact_id}`);
        return;
    }
}

module.exports = {
  createLead,
};
