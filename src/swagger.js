/**
 * @swagger
 * tags:
 *   - name: Contact
 *     description: Contact API
 *   - name: User
 *     description: User API
 *   - name: License
 *     description: License API
 *   - name: Event
 *     description: Event API
 *   - name: Opportunity
 *     description: Opportunity API
 *   - name: Quote
 *     description: Quote API
 */

   /**
 * @swagger
 * /api/contact:
 *   get:
 *     tags: [Contact]
 *     summary: Retrieve a list of Raiflow contacts.
 *     description: Retrieve a list of contacts from Raiflow. Can be used to populate a list of fake contacts when prototyping or testing an API.
 *     responses:
 *       200:
 *         description: A list of contacts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The user ID.
 *                         example: 0
 *                       name:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 */

 /**
 * @swagger
 * /api/contact:
 *   post:
 *     tags: [Contact]
 *     summary: Retrieve a list of Raiflow contacts.
 *     description: Retrieve a list of contacts from Raiflow. Can be used to populate a list of fake contacts when prototyping or testing an API.
 *     responses:
 *       200:
 *         description: A list of contacts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The user ID.
 *                         example: 0
 *                       name:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 */