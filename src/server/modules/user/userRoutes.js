"use strict";

var controller = require(__dirname + '/userController');

module.exports = function (app) {

  app.get('/', controller.getUser);

  app.post('/', controller.createUser);

};