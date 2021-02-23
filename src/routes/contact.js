/**
 * Contains all the endpoints of the user resource.
 */

"use strict";

const express = require("express");
const router = express.Router();

const { createContact } = require('../controllers/contact');

router.get("/", (req, res) => {
  res.status(200).send("Contact Resource");
});


router.post("/", (req, res, next) => {
  return createContact(req, res, next);
});

module.exports = router;
