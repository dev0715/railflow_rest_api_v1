/**
 * User controller.
 * Contains all the business logic executed after
 * hitting any user endpoint in routes.
 */

 "use strict";
 
 const ApiError = require("../errors/badrequest");
 const noteService = require('../services/note');
 const invoiceService = require('../services/invoice');
 const contactService = require('../services/contact');
 const accountService = require('../services/account');
 const slackService = require('../services/slack');
 const { checkToken } = require('../services/token');
 
 /**
  * Function: Create new Invoice
  * @param {*} req Request
  * @param {*} res Response
  * @param {*} next Next
  * @returns Promise
  */
 async function createInvoice(req, res, next) {
    // Middleware: Check token beforehand
    const isAuthenticated = await checkToken(req.headers.token);
    if (!isAuthenticated) {
      return res.status(400).send({
        status: 400,
        message: 'token invalid or missing'
      });
    }
  
     try {
         const data = {
             account_id: req.body.account_id,
             contact_id: req.body.contact_id,
             num_users: req.body.num_users,
             license_type: req.body.license_type,
             license_years: req.body.license_years || null,
         };
 
         if (typeof data.contact_id == 'undefined' || data.contact_id == '') {
             return res.status(400).send({
                 status: 400,
                 data: {
                     message: 'Missing required parameter: contact_id'
                 }
             });
         }
 
         if (typeof data.account_id == 'undefined' || data.account_id == '') {
             return res.status(400).send({
                 status: 400,
                 data: {
                     message: 'Missing required parameter: account_id'
                 }
             });
         }
 
         if (typeof data.num_users == 'undefined') {
             return res.status(400).send({
                 status: 400,
                 data: {
                     message: 'Missing required parameter: num_users'
                 }
             });
         }
 
         if (isNaN(req.body.num_users) || data.num_users < 0 || data.num_users > 49) {
             return res.status(400).send({
                 status: 400,
                 data: {
                     message: 'Invalid num_users: valid value is: 0-49'
                 }
             });
         }
         if (typeof req.body.license_type == "undefined") {
             return res.status(400).send({
                 status: 400,
                 data: {
                     message: 'Missing required parameter: license_type'
                 }
             });
         }

         if (typeof req.body.license_years == "undefined") {
             return res.status(400).send({
                 status: 400,
                 data: {
                     message: 'Missing required parameter: license_years'
                 }
             });
         }
 
         if (isNaN(req.body.license_years) || data.license_years < 1 || data.license_years > 3) {
             return res.status(400).send({
                 status: 400,
                 data: {
                     message: 'Invalid License_years: valid values are 1-3'
                 }
             });
         }
 
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
         const invoice = await invoiceService.createInvoice(data);
         if (invoice.error != null) {
             return res.status(400).send({
                 status: 400,
                 data: {
                     message: invoice.error.message,
                     account_id: req.body.account_id,
                     contact_id: req.body.contact_id
                 }
             });
         }
         await noteService.create(contact.id, `Invoice: https://railflow.hiveage.com/invs/${invoice.invoice.hash_key}`);
         await noteService.accountNote(account.id, `Invoice: https://railflow.hiveage.com/invs/${invoice.invoice.hash_key}`);
         
         await slackService.sendSlackMessage(`Railflow Invoice: <https://railflow.myfreshworks.com/crm/sales/accounts/${account.id}|${account.name}> <https://railflow.hiveage.com/invs/${invoice.invoice.hash_key}|invoice> :slightly_smiling_face:`);
         
         return res.status(201).send({
             status: 201,
             message: "Invoice created",
             invoiceLink: `https://railflow.hiveage.com/invs/${invoice.invoice.hash_key}`,
             opportunityLink: `https://railflow.myfreshworks.com/crm/sales/deals/${invoice.fsOpportunity.id}`
         });
 
     } catch (error) {
         console.log(`> error:controllers:invoice: ${error}`);
         return res.status(error.status).send(error.toJSON());
     }
 }
 
 module.exports = {
     createInvoice,
 };
 