/**
 * Contains all the endpoints of the user resource.
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
 *      produces:
 *          - application/json
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
 *      produces:
 *          - application/json
 *      consumes:
 *          - application/json
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
