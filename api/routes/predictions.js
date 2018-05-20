const express = require('express');
const router = express.Router();
const db = require('../db/index.js');

router.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.send(db.getPredictions('dummyuser'));
});

router.put('/', function(req, res, next) {
  db.setPredictions('dummyuser', req.body);
  res.status(204);
  res.send();
});

module.exports = router;