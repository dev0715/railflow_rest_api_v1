/**
 * Contains all the endpoints of the user resource.
 */
/**
 * @swagger
 * tags:
 *   - name: Contact
 *     description: Contact API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: The contact's first name.
 *           example: John
 *         lastName:
 *           type: string
 *           description: The contact's last name.
 *           example: Doe
 *         email:
 *           type: string
 *           description: The contact's email.
 *           example: johndoe@mail.me
 *         phone:
 *           type: string
 *           description: The contact's phone.
 *           example: 0987654321
 *         jobTitle:
 *           type: string
 *           description: The contact's job title.
 *           example: Developer
 *         company:
 *           type: string
 *           description: The contact's company.
 *           example: Railflow
 *         notify:
 *           type: boolean
 *           description: Notification flag.
 *           example: True
*/

"use strict";

const express = require("express");
const router = express.Router();

const { createContact,updateContact } = require('../controllers/contact');

router.get("/", (req, res) => {
  res.status(200).send("Contact Resource");
});

/**
 * @swagger
 * /api/contact:
 *    post:
 *      tags:
 *        - Contact
 *      summary: Create a contact
 *      description: |
 *          POST method to create a contact
 *          <br>1. Get First name, Last name, Email, Phone, Job Title from payload
 *          <br>2. Check if the email is already existed then then check "cf_license_status". 
 *          <br>--> If status is sent, response with the code 200 withe "Duplicate Registration" error message
 *          <br>--> If status is not sent, response with the code 201 created with the new contact info
 *          <br>3. Crate contact then response with the code 201 and created contact.
 *          <br>4. Check if the flag "Notify" is True then send slack message.
 *      produces:
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
 *                  type: object
 *                  $ref: '#/components/schemas/Contact'
 *      responses:
 *          200:
 *              description: Returns created contract
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      message:
 *                        type: string
 *                        description: Response message.
 *                        example: "Account created"
 *                      contact_id:
 *                        type: integer
 *                        description: The contact's id.
 *                        example: 16004426279
 *                      company_name:
 *                        type: string
 *                        description: The contact's company.
 *                        example: Railflow
 */
router.post("/", (req, res, next) => {
  return createContact(req, res, next);
});

/**
 * @swagger
 * /api/contact:
 *    patch:
 *      tags:
 *        - Contact
 *      summary: Update a contact
 *      description: |
 *          PATCH method to update a contact
 *          <br>1. Check if contact existed
 *          <br>--> YES, then update the contact
 *          <br>--> NO, response with the status code 200, error message "contact not found"
 *          <br>2. Get account by contact_cf_company. 
 *          <br>--> YES, get account info
 *          <br>--> NO, crate new account 
 *          <br>3. Create Notes and Task.
 *          <br>4. Update contact accordingly and response with the code 200 "contact verified".
 *      produces:
 *          - application/json
 *      consumes:
 *          - application/json
 *      parameters:
 *          - name: token
 *            in: header
 *            description: API Security Token
 *            required: true
 *            type: string
 *            example: YOUR_TOKEN_HERE
 *      requestBody:
 *         content:
 *            application/json:
 *               schema:
 *                  type: object
 *                  properties:
 *                    contact_id:
 *                      type: integer
 *                      description: The contact's id.
 *                      example: 16004426279
 *      responses:
 *          200:
 *              description: Returns signed up user
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      contact_id:
 *                        type: integer
 *                        description: The contact's id.
 *                        example: 16004426279
 *                      account_id:
 *                        type: integer
 *                        description: The contact's id.
 *                        example: 16004429999
 *                      company_name:
 *                        type: string
 *                        description: The contact's company.
 *                        example: Railflow
 *                      first_name:
 *                        type: string
 *                        description: The contact's first name.
 *                        example: John
 *                      last_name:
 *                        type: string
 *                        description: The contact's last name.
 *                        example: Doe
 *                      address:
 *                        type: string
 *                        description: The contact's address.
 *                        example: "123 Ping Street, Heaven"
 *                      city:
 *                        type: string
 *                        description: The contact's city.
 *                        example: "Heaven City"
 *                      state:
 *                        type: string
 *                        description: The contact's state.
 *                        example: "Heaven State"
 *                      zipcode:
 *                        type: string
 *                        description: The contact's zipcode.
 *                        example: 3000
 *                      country:
 *                        type: string
 *                        description: The contact's country.
 *                        example: Sky
 */
router.patch("/", (req, res, next) => {
  return updateContact(req, res, next);
});

module.exports = router;
