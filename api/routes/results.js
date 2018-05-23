const express = require('express');
const router = express.Router();
const db = require('../db/index.js');

const results = require('../db/results.json');
const groups = require('../db/groups.json');
const matches = require('../db/matches.json');
const calc = require('../data/calc.js');

router.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.send(results);
});

router.get('/groups', function(req, res, next) {
  const includePredictions = req.query.include_predictions === 'true';
  const predictions = includePredictions ? db.getPredictions('dummyuser') : { groups: {} };
  res.setHeader('Content-Type', 'application/json');
  res.send(calc.calculateGroupResults(results, groups, matches, predictions));
});

router.get('/knockout', function(req, res, next) {
  const includePredictions = req.query.include_predictions === 'true';
  const predictions = includePredictions ? db.getPredictions('dummyuser') : { groups: {} };
  res.setHeader('Content-Type', 'application/json');
  res.send(calc.calculateKnockout(results, groups, matches, predictions));
});

module.exports = router;