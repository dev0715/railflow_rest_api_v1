"use strict";

const express = require("express");
const router = express.Router();

const { extendLicense, extendLicenseSlack } = require("../controllers/license");

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
