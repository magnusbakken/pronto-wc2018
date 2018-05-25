const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const initialRouter = require('./routes/initial');
const predictionRouter = require('./routes/predictions');
const resultRouter = require('./routes/results');
const knockoutRouter = require('./routes/knockout');

const app = express();

const port = Number.parseInt(process.argv[2]) || 3000;
app.listen(port, () => {
  console.log(`Listening on localhost:${port}...`);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || origin.startsWith('localhost') || origin.startsWith('http://localhost') || origin.startsWith('https://localhost')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));

app.use('/initial', initialRouter);
app.use('/predictions', predictionRouter);
app.use('/results', resultRouter);
app.use('/knockout', knockoutRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
});

module.exports = app;