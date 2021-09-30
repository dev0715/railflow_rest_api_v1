"use strict";

const express = require("express");
const router = express.Router();

const { createHiveage } = require("../controllers/hiveage");

router.post("/", (req, res, next) => {
  return createHiveage(req, res, next);
});

module.exports = router;
