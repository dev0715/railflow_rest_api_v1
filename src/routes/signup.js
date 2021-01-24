/**
 * Contains all the endpoints of the user resource.
 */

"use strict";

const express = require("express");
const router = express.Router();

const { createLead } = require('../controllers/signup');

router.get("/", (req, res) => {
  res.status(200).send("Signup Resource");
});


router.post("/", (req, res, next) => {
  return createLead(req, res, next);
});

module.exports = router;
