const express = require('express');
const router = express.Router();

const groups = require('../db/groups.json');
const matches = require('../db/matches.json');
const teams = require('../db/teams.json');

router.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.send({
      groups: groups,
      matches: matches,
      teams: teams,
  });
});

module.exports = router;