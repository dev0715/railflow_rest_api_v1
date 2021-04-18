/**
 * Contains all the endpoints of the user resource.
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         contact_id:
 *           type: integer
 *           description: The contact's id.
 *           example: 16004426279
 *         contact_first_name:
 *           type: string
 *           description: The contact's first name.
 *           example: ali
 *         contact_last_name:
 *           type: string
 *           description: The contact's last name.
 *           example: raza
 *         contact_email:
 *           type: string
 *           description: The contact's email.
 *           example: test@perfmeter.io
 *         contact_cf_company:
 *           type: string
 *           description: The contact's company.
 *           example: c1
*/

"use strict";

const express = require("express");
const router = express.Router();

const { createLead } = require('../controllers/signup');

router.get("/", (req, res) => {
  res.status(200).send("Signup Resource");
});


/**
 * 
 * /api/verify:
 *    post:
 *      tags:
 *        - Contact
 *      summary: Verify a contact
 *      description: |
 *          POST method to create a quote
 *          <br>1. Validate the payload
 *          <br>2. Get cryptolen token
 *          <br>3. Send onboarding email
 *          <br>4. Create note and task
 *          <br>5. Update contact.
 *          <br>6. Response with 201 code, message "contact verified"
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
 *                  type: object
 *                  $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *              description: Returns signed up user
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/User'
 */
router.post("/", (req, res, next) => {
  return createLead(req, res, next);
});

module.exports = router;
