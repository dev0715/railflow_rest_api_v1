'use strict'

const express = require('express')
const router = express.Router()
const { create } = require('../controllers/register')

router.get('/', (req, res) => {
  res.status(200).send('Register Resource')
})

router.post('/', (req, res, next) => {
  return create(req, res, next)
})

module.exports = router
