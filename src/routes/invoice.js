/**
 * Contains all the endpoints of the user resource.
 */
/**
 * @swagger
 * tags:
 *   - name: Invoice
 *     description: Invoice API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Invoice:
 *       type: object
 *       properties:
 *         account_id:
 *           type: integer
 *           description: Account ID.
 *           example: 16001181618
 *         contact_id:
 *           type: integer
 *           description: Contact ID.
 *           example: 16004439128
 *         num_users:
 *           type: integer
 *           description: Number of users
 *           example: 21
 *         license_type:
 *           type: string
 *           description: Contact ID.
 *           example: standard
 *         license_years:
 *           type: integer
 *           description: Number of users
 *           example: 3
 *         hiveage_contact_email:
 *           type: string
 *           description: Contact Email.
 *           example:  careers@perfmeter.io
 *         hiveage_notification_emails:
 *           type: array
 *           description: Contact Email.
 *           items:
 *             type: string
 *           example: [email1@perfmeter.io,email2@perfmeter.io]
*/

"use strict";

const express = require("express");
const router = express.Router();

const { createInvoice } = require('../controllers/invoice');

router.get("/", (req, res) => {
  res.status(200).send("Invoice Resource");
});

/**
 * @swagger
 * /api/invoice:
 *    post:
 *      tags:
 *        - Invoice
 *      summary: Create Invoice
 *      description: |
 *          POST method to create an invoice
 *          <br>1. Validate the payload
 *          <br>2. Get contact info, if does not exist -> response with 404 not found message. 
 *          <br>3. Create Invoice.
 *          <br>4. Create note in contact and send slack message.
 *          <br>5. License year = 0,1,2,3 (0 means perpetual).
 *          <br>6. Response with code 201, invoice created.
 *          <br><br>[*] To use hiveage default format - remove hiveage_contact_email and hiveage_notification_emails
 *      produces:
 *          - application/json
 *      consumes:
 *          - application/json
 *      parameters:
 *        - name: token
 *          in: header
 *          description: API Security Token
 *          required: true
 *          type: string
 *          example: YOUR_TOKEN_HERE
 *      requestBody:
 *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Invoice'
 *      responses:
 *          201:
 *              description: Returns created contract
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/Invoice'
 */
router.post("/", (req, res, next) => {
  return createInvoice(req, res, next);
});

module.exports = router;
