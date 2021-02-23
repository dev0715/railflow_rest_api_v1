/**
 * Contains all the endpoints of the user resource.
 */

"use strict";

const express = require("express");
const router = express.Router();

const { extendLicense } = require('../controllers/license');

router.get("/", (req, res) => {
  res.status(200).send("License Resource");
});


router.post("/", (req, res, next) => {
  return extendLicense(req, res, next);
});

module.exports = router;
