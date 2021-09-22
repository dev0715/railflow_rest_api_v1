/**
 * Contains all the endpoints of the user resource.
 */
/**
 * @swagger
 * tags:
 *   - name: Hievage
 *     description: Hievage API
 */

/**
 * @swagger
*/

"use strict";

const express = require("express");
const router = express.Router();

const { createHiveage } = require('../controllers/hiveage');

/**
 * @swagger
 * /api/hievage:
 *    post:
 *      tags:
 *        - Hievage
 *      summary: Create Invoice
 *      description: |       
 */
router.post("/", (req, res, next) => {
  return createHiveage(req, res, next);
});

module.exports = router;
