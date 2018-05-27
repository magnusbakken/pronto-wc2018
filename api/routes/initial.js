const express = require('express');
const router = express.Router();

const groups = require('../db/groups.json');
const teams = require('../db/teams.json');

const SelfReloadJSON = require('self-reload-json');
const matches = new SelfReloadJSON(__dirname + '/../db/matches.json');

router.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.send({
      groups: groups,
      matches: matches,
      teams: teams,
  });
});

module.exports = router;