/**
 * @swagger
 * tags:
 *   - name: Contact
 *     description: Contact API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: The contact's first name.
 *           example: John
 *         lastName:
 *           type: string
 *           description: The contact's last name.
 *           example: Doe
 *         email:
 *           type: string
 *           description: The contact's email.
 *           example: johndoe@mail.me
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
 * /api/contact:
 *    get:
 *      tags:
 *        - Contact
 *      summary: Gets a list of contacts
 *      description: Returns a list of contacts
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: An array of contacts
 *              content:
 *                application/json:
 *                  schema:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Contact'
 */

/**
 * @swagger
 * /api/contact:
 *    post:
 *      tags:
 *        - Contact
 *      summary: Create Contact
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: Contact
 *            description: Contact information
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/components/schemas/Contact'
 *      responses:
 *          200:
 *              description: Returns created contract
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/Contact'
 */