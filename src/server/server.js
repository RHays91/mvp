require('dotenv').config({
  silent: true,
  path: __dirname + "/../../.env"
});

var express  = require('express'),
    morgan   = require('morgan'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//set config from .env file, environment variables for production
app.config = require(__dirname + '/config/config');

// configure our server with all the middleware and routing
require('./config/middleware.js')(app, express);
require('./config/passport.js')(passport);

app.listen(app.config.port);

console.log('Server listening on: ' + app.config.port);

// export for testing and flexibility
module.exports = app;