/**
 * Account controller.
 * Contains all the business logic executed after
 * hitting any user endpoint in routes.
 */

"use strict";

const ApiError = require("../errors/badrequest");
const accountService = require('../services/account');

async function updateAccount(req, res, next) {
    console.log('update account');
    const account = await accountService.getAccountById(req.body.account_id);
    if (!account) {
        return res.status(200).send({
            status: 200,
            data: {
                message: `account not found`,
                account_id: req.body.account_id
            }
        });
    }
    return res.status(200).send({
        status: 200,
        data: {
            message: 'updated account',
            account_id: req.body.account_id,
            company_name: req.body.company_name,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zipcode: req.body.zipcode,
            country: req.body.country,
            hiveage_contact_email: req.body.hiveage_contact_email,
            hiveage_fname: req.body.hiveage_fname,
            hivage_lname: req.body.hivage_lname,
        }
    });
}
module.exports = {
    updateAccount,
};
