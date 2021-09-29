/**
 * Contains all the endpoints of the Beats resource.
 */
/**
 * @swagger
 * tags:
 *   - name: Beats
 *     description: Beats API
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Beats:
 *       type: object
 *       properties:
 *         feature:
 *           type: string
 *           description: Feature name.
 *           example: Test sample
 *         event:
 *           type: string
 *           description: Event name.
 *         key:
 *           type: string
 *           description: Key name
 *           example: sample key
 *         value:
 *           type: string
 *           description: Value name
 *           example: sample value
 *         metadata:
 *           type: object
 *           properties:
 */

"use strict";

const express = require("express");
const router = express.Router();

const { registerBeats } = require("../controllers/beats");

router.get("/", (req, res) => {
  res.status(200).send("Beats Resource");
});

/**
 * @swagger
 * /api/beats:
 *    post:
 *      tags:
 *        - Beats
 *      summary: Create Beats
 *      description: |
 *          POST method to register a beat
 *          <br>1. Validate the payload
 *          <br>2. Send request to cryptolens together with the params data.
 *          <br>3. Response with code 200, beat registered.
 *      produces:
 *          - application/json
 *      consumes:
 *          - application/json
 *      requestBody:
 *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Beats'
 *      responses:
 *          200:
 *              description: Returns register beat
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/Beats'
 */
router.post("/", (req, res, next) => {
  return registerBeats(req, res, next);
});

module.exports = router;
