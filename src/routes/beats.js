"use strict";

const express = require("express");
const router = express.Router();

const { registerBeats } = require("../controllers/beats");

router.get("/", (req, res) => {
  res.status(200).send("Beats Resource");
});

router.post("/", (req, res, next) => {
  return registerBeats(req, res, next);
});

module.exports = router;
