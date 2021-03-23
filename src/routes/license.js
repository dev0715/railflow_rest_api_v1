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

const { extendLicense } = require('../controllers/license');

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
 *      produces:
 *          - application/json
 *      parameters:
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

module.exports = router;
