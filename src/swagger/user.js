/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User API
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
 *           example: 16003502848
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
 *         contact_cf_company:
 *           type: string
 *           description: The contact's company.
 *           example: Railflow
*/

/**
 * @swagger
 * /api/verify:
 *    post:
 *      tags:
 *        - User
 *      summary: Signup
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: User
 *            description: User information
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *              description: Returns signed up user
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/User'
 */