/**
 * Contains all the endpoints of the user resource.
 */
/**
 * @swagger
 * tags:
 *   - name: Pricing
 *     description: Pricing API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Pricing:
 *       type: object
 *       properties:
 *         base:
 *           type: number
 *           description: Base price.
 *           example: 1700
 *         increment:
 *           type: number
 *           description: Increment.
 *           example: 250
 *         users:
 *           type: string
 *           description: User range.
 *           example: 100-120
 *         num_users:
 *           type: number
 *           description: User index.
 *           example: 5
 *         base_price:
 *           type: number
 *           description: base + (users_index * increment).
 *           example: 2950
 *         years:
 *           type: number
 *           description: License years
 *           example: 2
 *         total_price:
 *           type: number
 *           description: years * base_price
 *           example: 11800
 *         discount_rate:
 *           type: number
 *           description: Discount Rate
 *           example: 0.1
 *         discount_amt:
 *           type: number
 *           description: discount_rate * total_price
 *           example: 2006
 *         final_price:
 *           type: number
 *           description: total_price - discount_amt
 *           example: 9794
*/

"use strict";

const express = require("express");
const router = express.Router();

const { getPricing } = require('../controllers/pricing');

/**
 * @swagger
 * /api/pricing:
 *    get:
 *      tags:
 *        - Pricing
 *      summary: Gets a list of Pricing
 *      description: |
 *        Returns a list of Pricing
 *        <br>1. if no query params are passing, only return the base price for both in response
 *        <br>2. when passing other params, calculate the price according to formula and return the pricing for the specified type + year + num_users
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: token
 *            in: header
 *            description: API Security Token
 *            required: true
 *            type: string
 *            example: YOUR_TOKEN_HERE
 *          - name: license_type
 *            in: query
 *            description: License Type
 *            required: false
 *            type: string
 *            example: enterprise
 *          - name: license_years
 *            in: query
 *            description: License Years
 *            required: false
 *            type: number
 *            example: 0
 *          - name: num_users
 *            in: query
 *            description: User Index
 *            required: false
 *            type: number
 *            example: 5
 *      responses:
 *          200:
 *              description: An array of Pricing
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/Pricing'
 */
router.get("/", (req, res, next) => {
  return getPricing(req, res, next);
});

module.exports = router;
