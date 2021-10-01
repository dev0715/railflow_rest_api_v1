"use strict";

const express = require("express");
const router = express.Router();

const { updateAccount } = require("../controllers/account");

router.get("/", (req, res) => {
  res.status(200).send("Account Resource");
});

router.put("/", (req, res, next) => {
  return updateAccount(req, res, next);
});

module.exports = router;
