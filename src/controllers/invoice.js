/**
 * User controller.
 * Contains all the business logic executed after
 * hitting any user endpoint in routes.
 */

"use strict";

const dayjs = require('dayjs');

const BadRequestError = require("../errors/badrequest");
const noteService = require('../services/note');
const invoiceService = require('../services/invoice');

async function createOpportunity(req, res, next) {
    try {
        const data = {
            name: req.body.deal_sales_account_name,
            business_email: req.body.deal_cf_contact_email,
            category: 'organization',
            currency: 'USD',
            address: req.body.deal_sales_account_address,
            city: req.body.deal_sales_account_city,
            state_name: req.body.deal_sales_account_state,
            zip_code: req.body.deal_sales_account_zipcode,
            country: req.body.deal_sales_account_country,
            phone: req.body.deal_sales_account_phone,
        };

        const resp = await invoiceService.createInvoiceClient(data);
        return res.status(resp.status).send({
            status: resp.status,
            data: resp.data
        });
    } catch (error) {
        return res.status(500).send({
            status: 500,
            data: {
                message: `Error while creating an opportunity`
            }
        });

    }
}

module.exports = {
    createOpportunity,
};
