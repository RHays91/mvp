var mongoose = require('mongoose');

module.exports = mongoose.Schema({
  soundCloudId: String,
  name: String,
  uri: String,
  city: String,
  accessToken: String,
  songs: [{type: mongoose.Schema.Types.ObjectId, ref:'Song'}]
});