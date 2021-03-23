/**
 * Contains all the endpoints of the user resource.
 */
/**
 * @swagger
 * tags:
 *   - name: Opportunity
 *     description: Opportunity API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Opportunity:
 *       type: object
 *       properties:
 *         deal_sales_account_name:
 *           type: string
 *           description: The Opportunity's deal sales account.
 *           example: John
 *         deal_cf_contact_email:
 *           type: string
 *           description: The Opportunity's deal contact email.
 *           example: johndoe@mail.me
 *         deal_sales_account_address:
 *           type: string
 *           description: The Opportunity's deal sales address.
 *           example: Deal Sales Account Address
 *         deal_sales_account_city:
 *           type: string
 *           description: The Opportunity's deal sales city.
 *           example: Deal Sales Account City
 *         deal_sales_account_state:
 *           type: string
 *           description: The Opportunity's deal sales state.
 *           example: Deal Sales Account State
 *         deal_sales_account_zipcode:
 *           type: string
 *           description: The Opportunity's zip code.
 *           example: 3000
 *         deal_sales_account_country:
 *           type: string
 *           description: The Opportunity's country.
 *           example: USA
 *         deal_sales_account_phone:
 *           type: string
 *           description: The Opportunity's phone.
 *           example: +1 0987654321
*/

"use strict";

const express = require("express");
const router = express.Router();

const { createOpportunity } = require('../controllers/opportunity');

/**
 * @swagger
 * /api/opportunity:
 *    get:
 *      tags:
 *        - Opportunity
 *      summary: Gets a list of opportunities
 *      description: Returns a list of opportunities
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: An array of opportunities
 *              content:
 *                application/json:
 *                  schema:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Opportunity'
 */

router.get("/", (req, res) => {
  res.status(200).send("Opportunity Resource");
});


/**
 * @swagger
 * /api/opportunity:
 *    post:
 *      tags:
 *        - Opportunity
 *      summary: Create Opportunity
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: Opportunity
 *            description: Opportunity information
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/components/schemas/Opportunity'
 *      responses:
 *          200:
 *              description: Returns created opportunity
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/Opportunity'
 */
router.post("/", (req, res, next) => {
  return createOpportunity(req, res, next);
});

module.exports = router;
