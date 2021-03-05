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
 *         firstName:
 *           type: string
 *           description: First name.
 *           example: John
 *         lastName:
 *           type: string
 *           description: Lirst name.
 *           example: Doe
 *         email:
 *           type: string
 *           description: Email.
 *           example: hellosumedhdev@gmail.com
 *         phone:
 *           type: string
 *           description: Phone number
 *           example: 0987654321
 *         company:
 *           type: string
 *           description: Company name
 *           example: Railflow
 *         num_of_users:
 *           type: integer
 *           description: Number of users
 *           example: 10
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
 *      parameters:
 *          - name: Quote
 *            description: Quote information
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/components/schemas/Quote'
 *      responses:
 *          200:
 *              description: Returns created contract
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/Quote'
 */