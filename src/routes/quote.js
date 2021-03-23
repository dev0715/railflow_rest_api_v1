/**
 * Contains all the endpoints of the user resource.
 */
/**
 * @swagger
 * tags:
 *   - name: Quote
 *     description: Quote API
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Quote:
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
*/

"use strict";

const express = require("express");
const router = express.Router();

const { createQuote } = require('../controllers/quote');

router.get("/", (req, res) => {
  res.status(200).send("Quote Resource");
});


/**
 * @swagger
 * /api/quote:
 *    post:
 *      tags:
 *        - Quote
 *      summary: Create Quote
 *      produces:
 *          - application/json
 *      consumes:
 *          - application/json
 *      requestBody:
 *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Quote'
 *      responses:
 *          200:
 *              description: Returns created contract
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/Quote'
 */
router.post("/", (req, res, next) => {
  return createQuote(req, res, next);
});

module.exports = router;
