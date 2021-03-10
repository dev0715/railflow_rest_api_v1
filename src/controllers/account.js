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
    let oldNetwork, newNetwork = null;
    const networkData = {
        "name": req.body.company_name,
        "first_name": req.body.hiveage_fname,
        "last_name": req.body.hivage_lname,
        "address": req.body.address,
        "city": req.body.city,
        "state_name": req.body.state,
        "zip_code": req.body.zipcode,
        "country": req.body.country,
        "business_email": req.body.hiveage_contact_email,
        "primary_contact_first_name": req.body.hiveage_fname,
        "primary_contact_last_name": req.body.hivage_lname,
        "category":"organization",
        "currency": "USD",
        "language": "en-us",
    };
    // check and create new network
    if (account.custom_field.cf_hiveage_hash != null) {
        oldNetwork = await accountService.getHiveageNetwork(account.custom_field.cf_hiveage_hash);
    }
    if (account.custom_field.cf_hiveage_hash == null || !oldNetwork) {
        try {
            newNetwork = await accountService.createHiveageNetwork (networkData);
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
    if (oldNetwork) {
        try {
            const updatedNetwork = await accountService.updateHiveageNetwork (oldNetwork.hash_key,networkData);
            return res.status(200).send({
                status: 200,
                data: {
                    message: 'updated account',
                    account_id: req.body.account_id,
                    connection_id: oldNetwork.id,
                    connection_hash: oldNetwork.hash_key
                }
            });
        } catch (error) {
            console.log('error when update hiveage network');
            return res.status(500).send({
                status: 500,
                data: {
                    message: `error when update hiveage network`,
                    account_id: req.body.account_id,
                    connection_hash: oldNetwork.hash_key
                }
            });
        }
    } else {
        const updatedAccount = await accountService.updateHiveageHash(account.id, newNetwork.hash_key);
        return res.status(200).send({
            status: 200,
            data: {
                message: 'updated account',
                account_id: req.body.account_id,
                connection_id: newNetwork.id
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
