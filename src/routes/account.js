/**
 * @swagger
 * tags:
 *   - name: Account
 *     description: Account API
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     Account:
 *       type: object
 *       properties:
 *           account_id:
 *             type: integer
 *             description: The account's id.
 *             example: 16001181618
 *           company_name:
 *             type: string
 *             description: The company name.
 *             example: Railflow
 *           address:
 *             type: string
 *             description: The account's address.
 *             example: "123 Ping Street, Heaven"
 *           city:
 *             type: string
 *             description: The account's city.
 *             example: "Heaven City"
 *           state:
 *             type: string
 *             description: The account's state.
 *             example: "Heaven State"
 *           zipcode:
 *             type: string
 *             description: The account's zipcode.
 *             example: 3000
 *           country:
 *             type: string
 *             description: The account's country.
 *             example: Sky
 *           hiveage_contact_email:
 *             type: string
 *             description: The account's hiveage email.
 *             example: JohnDoe@3mail.com
 *           hiveage_fname:
 *             type: string
 *             description: The hiveage first name.
 *             example: John
 *           hivage_lname:
 *             type: string
 *             description: The hiveage last name.
 *             example: Doe
*/

/**
 * Contains all the endpoints of the user resource.
 */

 "use strict";

 const express = require("express");
 const router = express.Router();
 
 const { updateAccount } = require('../controllers/account');
 
 /**
  * Account GET
  */
 router.get("/", (req, res) => {
   res.status(200).send("Account Resource");
 });
 
 /**
 * @swagger
 * /api/account:
 *    put:
 *      tags:
 *        - Account
 *      summary: Update a account
 *      description: |
 *          PUT method to update a account
 *          <br>1. Get account by ID
 *          <br>2. Get Hiveage network, if does not exist then create new network
 *          <br>3. Update account accordingly then response with the status 200
 *          <br>4. If account does not exist, response with the status 200 with the message "account not found".
 *      produces:
 *          - application/json
 *      parameters:
 *        - name: token
 *          in: header
 *          description: API Security Token
 *          required: true
 *          type: string
 *          example: YOUR_TOKEN_HERE
 *      consumes:
 *          - application/json
 *      requestBody:
 *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Account'
 *      responses:
 *          200:
 *              description: Returns signed up user
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      account_id:
 *                        type: integer
 *                        description: The account's id.
 *                        example: 16001181618
 *                      hiveage:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: integer
 *                            description: The connection's id.
 *                            example: 16004429999
 *                          hash_key:
 *                            type: integer
 *                            description: The connection's hash.
 *                            example: xxxxxxxx
 */
 router.put("/", (req, res, next) => {
   return updateAccount(req, res, next);
 });
 
 module.exports = router;
 