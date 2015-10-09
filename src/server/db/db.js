var config = require('../config/config');
var mongoose = require('mongoose');

mongoose.connect(config.db.host);

var userSchema = require('./collections/User');
var songSchema = require('./collections/Song');

var User = mongoose.model('User', userSchema);
var Song = mongoose.model('Song', songSchema);

exports.User = User;
exports.Song = Song;