"use strict";

const express = require("express");
const router = express.Router();

const { createEvent } = require("../controllers/event");

router.get("/", (req, res) => {
  res.status(200).send("Event Resource");
});

router.post("/", (req, res, next) => {
  return createEvent(req, res, next);
});

module.exports = router;
