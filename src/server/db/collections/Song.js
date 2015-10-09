var mongoose = require('mongoose');

module.exports = mongoose.Schema({
  trackId: String,
  title: String,
  artist: String,
  duration: String,
  stream_url: String,
  uri: String,
  bpm: String,
  users: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}]
});