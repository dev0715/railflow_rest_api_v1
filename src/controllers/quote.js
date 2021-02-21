/**
 * User controller.
 * Contains all the business logic executed after
 * hitting any user endpoint in routes.
 */

"use strict";

const dayjs = require('dayjs');

const ApiError = require("../errors/badrequest");
const noteService = require('../services/note');
const quoteService = require('../services/quote');
const contactService = require('../services/contact');
const slackService = require('../services/slack');

async function createQuote(req, res, next) {
    try {
        const data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            jobTitle: req.body.jobTitle,
            company: req.body.company,
        };

        // check if the contact is already there.
        let contact;
        const alreadyPresent = await contactService.getContactIfAlreadyPresent(req.body.email);
        if (alreadyPresent != null) {
            contact = alreadyPresent;
        } else {
            const response = await contactService.create(data);
            if (response && response.data && response.data.contact) {
                contact = response.data.contact;
            }
        }

        const quote = await quoteService.create({
            user: contact,
            num_of_users: req.body.num_of_users,
        });

        await noteService.create(contact.id, `Quote created for contact: ${contact.id}`);
        await slackService.sendSlackMessage(`New Quote created for contact; ${contact.email}`);

        return res.status(200).send({
            status: 200,
            data: {
                quote,
                ...{ quoteLink: `https://railflow.hiveage.com/estm/${quote.estimate.hash_key}`}
            }
        });

        throw new ApiError(`Something went wrong while creating quote.`);
    } catch (error) {
        console.log(`> error:controllers:quote: ${error}`);
        return res.status(error.status).send(error.toJSON());
    }
}

module.exports = {
    createQuote,
};
