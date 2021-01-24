/**
 * Contains all the endpoints of the user resource.
 */

"use strict";

const express = require("express");
const router = express.Router();

const { createOpportunity } = require('../controllers/opportunity');

router.get("/", (req, res) => {
  res.status(200).send("Opportunity Resource");
});


router.post("/", (req, res, next) => {
  return createOpportunity(req, res, next);
});

module.exports = router;
