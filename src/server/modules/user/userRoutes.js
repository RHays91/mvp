"use strict";

var controller = require(__dirname + '/userController');

module.exports = function (app) {

  app.post('/', controller.createUser);

  app.get('/', controller.getUser);

};