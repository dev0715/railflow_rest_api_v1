"use strict";

const express = require("express");
const router = express.Router();

const { getPricing } = require("../controllers/pricing");

router.get("/", (req, res, next) => {
  return getPricing(req, res, next);
});

module.exports = router;
