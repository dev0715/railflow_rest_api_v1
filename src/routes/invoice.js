"use strict";

const express = require("express");
const router = express.Router();

const { createInvoice } = require("../controllers/invoice");

router.get("/", (req, res) => {
  res.status(200).send("Invoice Resource");
});

router.post("/", (req, res, next) => {
  return createInvoice(req, res, next);
});

module.exports = router;
