var soundCloudAuth      = require('./config.js').passport.soundcloud,
    SoundCloudStrategy  = require('passport-soundcloud').Strategy,
    findOrSaveUser      = require('../modules/user/userModel').createUser;

module.exports = function(passport) {   

  // FACEBOOK PASSPORT STRATEGY
  passport.use(new SoundCloudStrategy(soundCloudAuth,

    // Passport verification function
    function (accessToken, refreshToken, profile, done) {

      // async verification
      process.nextTick(function(){

        findOrSaveUser(accessToken, profile, function (err, user){
          return user;
        });

      });
    }));

  // serialize userId to store during session setup
  passport.serializeUser(function (user, done) {
    console.log("USER IN SERIALIZE: ", user);
    done(null, user);
  });

  // find user by id when deserializing
  passport.deserializeUser(function (user, done) {
    console.log("USER IN DESERIALIZE: ", user);
    User.findOne({soundCloudId: user.soundCloudId}, function (err, user) {
      done(null, user);
    });
  });

};
