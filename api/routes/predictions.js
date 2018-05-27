const express = require('express');
const router = express.Router();

const db = require('../db/index.js');

const SelfReloadJSON = require('self-reload-json');
const matches = new SelfReloadJSON(__dirname + '/../db/matches.json');
const results = new SelfReloadJSON(__dirname + '/../db/results.json');

const REQUIRED_GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const REQUIRED_KNOCKOUT_ROUNDS = ['16', '8', '4', '2', '1'];

router.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  const predictions = db.getPredictions('dummyuser');
  if (!predictions.groups) {
    predictions.groups = {};
  }
  for (const group in REQUIRED_GROUPS) {
    if (!predictions.groups[group]) {
      predictions.groups[group] = [];
    }
  }
  if (!predictions.knockout) {
    predictions.knockout = {};
  }
  for (const round in REQUIRED_KNOCKOUT_ROUNDS) {
    if (!predictions.knockout[round]) {
      predictions.knockout[round] = [];
    }
  }
  res.send(predictions);
});

function saveFailed(res, reason) {
  res.status(400);
  res.send(reason);
}

function validatePredictions(res, predictions) {
  if (!predictions) {
    saveFailed(res, 'No predictions given');
    return false;
  } else if (!predictions.groups) {
    saveFailed(res, 'No group stage in predictions');
    return false;
  } else if (!predictions.knockout) {
    saveFailed(res, 'No knockout stage in predictions');
    return false;
  } else if (Object.keys(predictions).some(r => r !== 'groups' && r !== 'knockout')) {
    const extraKeys = Object.keys(predictions).filter(r => r !== 'groups' && r !== 'knockout');
    saveFailed(res, `Invalid extra keys in predictions: ${JSON.stringify(extraKeys)}`);
    return false;
  } else if (REQUIRED_GROUPS.some(g => !predictions.groups[g])) {
    const missingGroups = REQUIRED_GROUPS.filter(g => !predictions.groups[g]);
    saveFailed(res, `Missing group(s) in predictions: ${JSON.stringify(missingGroups)}`);
    return false;
  } else if (REQUIRED_KNOCKOUT_ROUNDS.some(r => !predictions.knockout[r])) {
    const missingRounds = REQUIRED_KNOCKOUT_ROUNDS.filter(g => !predictions.knockout[g]);
    saveFailed(res, `Missing knockout round(s) in predictions: ${JSON.stringify(missingRounds)}}`);
    return false;
  }
  return true;
}

function sanitizePredictions(newPredictions, currentPredictions, matches, results) {
  const now = new Date();
  const sanitizedPredictions = {
    groups: {},
    knockout: {},
  };
  currentPredictions = currentPredictions || {};
  if (!currentPredictions.groups) {
    currentPredictions.groups = {};
  }
  if (!currentPredictions.knockout) {
    currentPredictions.knockout = {};
  }
  for (const group in results.groups) {
    sanitizedPredictions.groups[group] = [];
    let idx = 0;
    for (const matchResult of results.groups[group]) {
      const match = matches.groups[group][idx];
      if (matchResult === null && new Date(match.date) > now) {
        sanitizedPredictions.groups[group].push(newPredictions.groups[group][idx] || null);
      } else {
        if (!sanitizedPredictions.groups[group]) {
          sanitizedPredictions.groups[group] = [];
        }
        sanitizedPredictions.groups[group].push(currentPredictions.groups[group][idx] || null);
      }
      idx++;
    }
  }
  for (const knockoutRound in results.knockout) {
    sanitizedPredictions.knockout[knockoutRound] = [];
    let idx = 0;
    for (const matchResult of results.knockout[knockoutRound]) {
      const match = matches.knockout[knockoutRound][idx];
      if (matchResult === null && match.date > now) {
        sanitizedPredictions.knockout[knockoutRound].push(newPredictions.knockout[knockoutRound][idx] || null);
      } else {
        if (!sanitizedPredictions.knockout[knockoutRound]) {
          sanitizedPredictions.knockout[knockoutRound] = [];
        }
        sanitizedPredictions.knockout[knockoutRound].push(currentPredictions.knockout[knockoutRound][idx] || null);
      }
      idx++;
    }
  }
  return sanitizedPredictions;
}

router.put('/', function(req, res, next) {
  if (!validatePredictions(res, req.body)) {
    return;
  }
  const currentPredictions = db.getPredictions('dummyuser');
  const predictions = sanitizePredictions(req.body, currentPredictions, matches, results);
  db.setPredictions('dummyuser', predictions);
  res.status(204);
  res.send();
});

module.exports = router;