const express = require('express');
const router = express.Router();
const results = require('../db/results.json');

router.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.send(results);
});

module.exports = router;