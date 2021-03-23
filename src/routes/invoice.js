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
 *      produces:
 *          - application/json
 *      consumes:
 *          - application/json
 *      requestBody:
 *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Invoice'
 *      responses:
 *          200:
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
