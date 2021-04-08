/**
 * Contains all the endpoints of the user resource.
 */

"use strict";
/**
 * @swagger
 * tags:
 *   - name: Event
 *     description: Event API
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     signature: 
 *       type: object
 *       properties:
 *         timestamp:
 *           type: string
 *           timestamp: Timestamp
 *           example: 1610120663
 *         token:
 *           type: string
 *           description: Token
 *           example: 852e50b93c2ec0ea98878a6795f30e7caa411e3faead7248ba
 *         signature:
 *           type: string
 *           timestamp: Signature
 *           example: cd25e64c20f708cedec5d84179b668459d31e40c3d9577d3a1593aae1851d92d
 *     event-data:
 *       type: object
 *       properties:
 *         tags:
 *           type: array
 *           description: Tags
 *           items:
 *             type: string
 *         timestamp:
 *           type: string
 *           description: Timestamp
 *           example: 1610120663
 *         storage:
 *           type: object
 *           description: Storage
 *           properties:
 *             url:
 *               type: string
 *               description: URL
 *               example: https://sw.api.mailgun.net/v3/domains/mail.railflow.io/messages/AgEFgJp6plBQ1kJyvilMpZnJD-c1sAG8ZA==
 *             key:
 *               type: string
 *               description: Key
 *               example: AgEFgJp6plBQ1kJyvilMpZnJD-c1sAG8ZA==
 *         recipient-domain:
 *           type: string
 *           description: Recipient Domain
 *           example: agiletestware.com
 *         campaigns:
 *           type: array
 *           description: Tags
 *           items:
 *             type: string
 *         user-variables:
 *           type: object
 *           description: Storage
 *           properties:
 *             contactId:
 *               type: string
 *               description: Contact ID
 *               example: 16002128724
 *         flags:
 *           type: object
 *           description: Storage
 *           properties:
 *             is-routed:
 *               type: boolean
 *               description: Is Routed
 *               example: false
 *             is-authenticated:
 *               type: boolean
 *               description: Is Authenticated
 *               example: true
 *             is-system-test:
 *               type: boolean
 *               description: Is System Test
 *               example: false
 *             is-test-mode:
 *               type: boolean
 *               description: Is Test Mode
 *               example: false
 *         log-level:
 *           type: string
 *           description: ID.
 *           example: info
 *         envelope:
 *           type: object
 *           description: Envelope
 *           properties:
 *             sending-ip:
 *               type: string
 *               description: Sending IP
 *               example: 159.135.228.13
 *             sender:
 *               type: string
 *               description: Sender
 *               example: postmaster@mail.railflow.io
 *             transport:
 *               type: string
 *               description: Transport
 *               example: smtp
 *             targets:
 *               type: string
 *               description: Targets
 *               example: ali.raza@agiletestware.com
 *         message:
 *           type: object
 *           description: Envelope
 *           properties:
 *             header:
 *                  description: Message Header
 *                  type: object
 *                  properties:
 *                      to:
 *                          type: string
 *                          description: To
 *                          example: hellosumedhdev@gmail.com, sales@railflow.myfreshworks.com, ali.raza@agiletestware.com
 *                      message-id:
 *                          type: string
 *                          description: Message ID
 *                          example: 20210108144141.1.06C9CD9FF505E245@mail.railflow.io
 *                      from:
 *                          type: string
 *                          description: From
 *                          example: "Railflow Support <mail@railflow.io>"
 *                      subject:
 *                          type: string
 *                          description: Subject
 *                          example: "Railflow: Your license key is here."
 *             attachments:
 *               description: Attachments
 *               type: array
 *               items:
 *                   type:string
 *             size:
 *               type: integer
 *               description: Size
 *               example: 480
 *         recipient:
 *             type: string
 *             description: Recipient
 *             example: ali.raza@agiletestware.com
 *         event:
 *             type: string
 *             description: Event
 *             example: delivered
 *         delivery-status:
 *           type: object
 *           description: Delivery Status
 *           properties:
 *             tls:
 *               type: boolean
 *               description: TLS Encryption
 *               example: true
 *             mx-hos:
 *               type: string
 *               description: MX Host
 *               example: aspmx.l.google.com
 *             attempt-no:
 *               type: integer
 *               description: Attemps
 *               example: 1
 *             description:
 *               type: string
 *               description: Targets
 *               example: 
 *             session-seconds:
 *               type: number
 *               format: float
 *               description: Session Seconds
 *               example: 4.092444181442261
 *             utf8:
 *               type: boolean
 *               description: UTF8 Character Code
 *               example: true
 *             code:
 *               type: integer
 *               description: Code
 *               example: 250
 *             message:
 *               type: string
 *               description: Message
 *               example: This is message
 *             certificate-verified:
 *               type: boolean
 *               description: Certificate Verified
 *               example: true
*/

const express = require("express");
const router = express.Router();

const { createEvent } = require('../controllers/event');

router.get("/", (req, res) => {
  res.status(200).send("Event Resource");
});


/**
 * @swagger
 * /api/event:
 *    post:
 *      tags:
 *        - Event
 *      summary: Event webhook
 *      description: |
 *          POST method to create an event
 *          <br>1. Validate the payload
 *          <br>2. Update the event. 
 *          <br>3. Add note.
 *          <br>4. Response with code 200, account created.
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: token
 *            in: header
 *            description: API Security Token
 *            required: true
 *            type: string
 *            example: HAhFXukfwrN3SrDMhhYetfAE
 *          - name: Event
 *            description: Event Payload
 *            in: body
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                signature:
 *                  $ref: '#/components/schemas/signature'
 *                event-data:
 *                  $ref: '#/components/schemas/event-data'
 *      responses:
 *          200:
 *              description: Return created event for contact ID
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/event-data'
 */
router.post("/", (req, res, next) => {
  return createEvent(req, res, next);
});

module.exports = router;
