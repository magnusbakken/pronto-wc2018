const express = require('express');
const router = express.Router();
const db = require('../db/index.js');

const groups = require('../db/groups.json');
const calc = require('../data/calc.js');

const SelfReloadJSON = require('self-reload-json');
const matches = new SelfReloadJSON(__dirname + '/../db/matches.json');
const results = new SelfReloadJSON(__dirname + '/../db/results.json');

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