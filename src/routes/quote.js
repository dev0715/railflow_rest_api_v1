/**
 * Contains all the endpoints of the user resource.
 */

"use strict";

const express = require("express");
const router = express.Router();

const { createQuote } = require('../controllers/quote');

router.get("/", (req, res) => {
  res.status(200).send("Quote Resource");
});


router.post("/", (req, res, next) => {
  return createQuote(req, res, next);
});

module.exports = router;
