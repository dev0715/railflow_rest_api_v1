"use strict";

const express = require("express");
const router = express.Router();

const { createContact, updateContact, searchContact } = require("../controllers/contact");

router.get("/", (req, res) => {
  return searchContact(req, res);
});

router.post("/", (req, res, next) => {
  return createContact(req, res, next);
});

router.patch("/", (req, res, next) => {
  return updateContact(req, res, next);
});

router.get("/", (req, res) => {
  return searchContact(req, res);
});

module.exports = router;
