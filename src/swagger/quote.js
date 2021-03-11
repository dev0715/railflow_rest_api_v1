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


/**
 * @swagger
 * /api/quote:
 *    get:
 *      tags:
 *        - Quote
 *      summary: Gets a list of Quotes
 *      description: Returns a list of Quotes
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: An array of Quotes
 *              content:
 *                application/json:
 *                  schema:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Quote'
 */

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