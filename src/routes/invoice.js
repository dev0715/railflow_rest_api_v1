/**
 * Contains all the endpoints of the user resource.
 */

"use strict";

const express = require("express");
const router = express.Router();

const { createOpportunity } = require('../controllers/opportunity');

router.get("/", (req, res) => {
  res.status(200).send("Invoice Resource");
});


router.post("/", (req, res, next) => {
  res.status(200).send("Invoice POST");
  // return createOpportunity(req, res, next);
});

module.exports = router;
