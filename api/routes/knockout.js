const express = require('express');
const router = express.Router();
const db = require('../db/index.js');

const results = require('../db/results.json');
const groups = require('../db/groups.json');
const matches = require('../db/matches.json');
const calc = require('../data/calc.js');

router.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.send(calc.calculateKnockoutBracket(results, groups, matches, db.getPredictions('dummyuser')));
});

module.exports = router;