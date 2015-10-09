"use strict";

var controller = require(__dirname + '/songController');

module.exports = function (app) {

  app.post('/', controller.addSong);

  app.get('/', controller.getSong);

  app.get('/:songId/play', controller.playSong);

};