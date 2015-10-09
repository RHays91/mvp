var User    = require('./userModel'),
    sendRes = require('../../config/helpers');

module.exports = {

  createUser: function(req, res, next){

    User.createUser(req.user.accessToken, req.user, function (err, user){
      
      if (err) {
        next(err);
      } else {
        sendRes(res, user, 201);
      }

    });

  },

  getUser: function(req, res, next){

    User.getUser(req.user.soundCloudId, function (err, user){

      if (err) {
        next(err);
      }
      if (user === 404){
        sendRes(res, {}, 404);
      } else {
        sendRes(res, user, 200);
      }

    });

  }

};
