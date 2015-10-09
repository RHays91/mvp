var db = require('../../db/db');
var User = db.User;

module.exports = {

  createUser: function (accessToken, profile, done){
    
    User.findOne({soundCloudId: profile.id}, function (err, user){
      
      if (err) {
        return done(err);
      }
      // if user is found, log them in
      if (user) {
        return done(null, user);
      } 
      // else create a new user in our DB
      else {
        var newUser = new User();

        newUser.soundCloudId  = profile.id;
        newUser.name          = profile.full_name;
        newUser.uri           = profile.uri;
        newUser.city          = profile.city;
        newUser.accessToken   = accessToken;

        newUser.save(function(err){
          if (err){
            // console.log('USER DB SAVE ERROR: ', err);
          }
          return done(null, newUser);
        })
      }
    });

  },

  getUser: function (userId, done){

    User.findOne({soundCloudId: userId}, function (err, user){

      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, 404);
      }
      else {
        return done(null, user);
      }

    });

  }

};