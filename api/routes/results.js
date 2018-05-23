const express = require('express');
const router = express.Router();

const results = require('../db/results.json');
const groups = require('../db/groups.json');
const matches = require('../db/matches.json');
const calc = require('../data/calc.js');

router.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.send(results);
});

router.get('/groups', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.send(calc.calculateGroupResults(results, groups, matches));
});

module.exports = router;