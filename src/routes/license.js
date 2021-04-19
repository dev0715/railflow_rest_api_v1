/**
 * Contains all the endpoints of the user resource.
 */

/**
 * @swagger
 * tags:
 *   - name: License
 *     description: License API
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     License:
 *       type: object
 *       properties:
 *         contact_id:
 *           type: integer
 *           description: The contact's id.
 *           example: 16003502848
 *         contact_cf_license_key:
 *           type: string
 *           description: The contact's id.
 *           example: ICWUF-JHARN-GEGRI-XDMYN
 *         contact_cf_extension_period:
 *           type: integer
 *           description: The contact's extension period.
 *           example: 6
 *         contact_first_name:
 *           type: string
 *           description: The contact's first name.
 *           example: John
 *         contact_last_name:
 *           type: string
 *           description: The contact's last name.
 *           example: Doe
 *         contact_email:
 *           type: string
 *           description: The contact's email.
 *           example: hellosumedhdev@gmail.com
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
*/



/**
 * @swagger
 * /api/license:
 *    get:
 *      tags:
 *        - License
 *      summary: Gets a list of licenses
 *      description: Returns a list of licenses
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: token
 *            in: header
 *            description: API Security Token
 *            required: true
 *            type: string
 *            example: YOUR_TOKEN_HERE
 *      responses:
 *          200:
 *              description: An array of licenses
 *              content:
 *                application/json:
 *                  schema:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/License'
 */

"use strict";

const express = require("express");
const router = express.Router();

const { extendLicense, extendLicenseSlack } = require('../controllers/license');

router.get("/", (req, res) => {
  res.status(200).send("License Resource");
});



/**
 * @swagger
 * /api/license:
 *    patch:
 *      tags:
 *        - License
 *      summary: Extend License
 *      description: |
 *          PATCH method to extend license
 *          <br>1. Get contact info, if does not exist -> response with 404 not found message. 
 *          <br>3. Try to extend license.
 *          <br>3. Add note in contact.
 *          <br>4. Response with code 200, license extended.
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: token
 *            in: header
 *            description: API Security Token
 *            required: true
 *            type: string
 *            example: YOUR_TOKEN_HERE
 *          - name: License
 *            description: License information
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/components/schemas/License'
 *      responses:
 *          200:
 *              description: Returns extended license
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/License'
 */
router.patch("/", (req, res, next) => {
  return extendLicense(req, res, next);
});


router.post("/slack", (req, res, next) => {
  return extendLicenseSlack(req, res, next);
});

module.exports = router;
