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
const accountService = require('../services/account');
const slackService = require('../services/slack');

async function createQuote(req, res, next) {
    try {
        const data = {
            account_id: req.body.account_id,
            contact_id: req.body.contact_id,
            hiveage_id: req.body.hiveage_id,
            hiveage_hash: req.body.hiveage_id,
            number_of_users: req.body.number_of_users,
            license_type: req.body.license_type,
            license_years: req.body.license_years,
        };

        // check if the contact is already there.
        let contact = await contactService.getContactById(data.contact_id);
        if (!contact) {
            return res.status(404).send({
                status: 404,
                data: {
                    message: 'Contact does not exist',
                    contact_id: data.contact_id
                }
            });
        } 
        data.user = contact;
        let account = await accountService.getAccountById(data.account_id);
        if (!account) {
            return res.status(404).send({
                status: 404,
                data: {
                    message: 'Account does not exist',
                    contact_id: data.account_id
                }
            });
        }
        data.account = account;
        let network = null;
        if (account.custom_field.cf_hiveage_hash != null) {
            network = await accountService.getHiveageNetwork(account.custom_field.cf_hiveage_hash);
        }
        if (account.custom_field.cf_hiveage_hash == null || !network) {
            const networkData = {
                "name": account.name,
                "first_name": contact.first_name,
                "last_name": contact.last_name,
                "address": contact.address,
                "city": contact.city,
                "state_name": contact.state,
                "zip_code": contact.zipcode,
                "country": contact.country,
                "business_email": contact.email,
                "primary_contact_first_name": contact.first_name,
                "primary_contact_last_name": contact.last_name,
                "category":"organization",
                "currency": "USD",
                "language": "en-us",
            };
            try {
                network = await accountService.createHiveageNetwork (networkData);
                const updatedAccount = await accountService.updateHiveageHash(account.id, network.hash_key);
            } catch (error) {
                console.log('error when create hiveage network');
                return res.status(500).send({
                    status: 500,
                    data: {
                        message: `error when create hiveage network`,
                        account_id: req.body.account_id
                    }
                });
            }
        } 
        data.network = network;
        const quote = await quoteService.create(data);

        await noteService.create(contact.id, `Quote created for contact: ${contact.id}, account: ${account.id}`);
        await slackService.sendSlackMessage(`New Quote created for contact id: ${contact.id}, account: ${account.id}`);
        
        return res.status(200).send({
            status: 200,
            data: {
                message: "Quote created",
                quote,
                ...{ quoteLink: `https://railflow.hiveage.com/estm/${quote.estimate.hash_key}`}
            }
        });

    } catch (error) {
        console.log(`> error:controllers:quote: ${error}`);
        return res.status(error.status).send(error.toJSON());
        // throw new ApiError(`Something went wrong while creating quote.`);
    }
}

module.exports = {
    createQuote,
};
