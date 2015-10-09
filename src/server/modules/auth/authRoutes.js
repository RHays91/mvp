module.exports = function (app, passport) {

  app.get('/loggedin', function (req, res) {
    var verdict = req.isAuthenticated();
    console.log('VERDICT: ', verdict);
    res.send(req.isAuthenticated() ? req.user : '0');
  });

  app.get('/logout', function (req, res){
    req.session.destroy(function (err) {
      req.logout();
      res.end();
    });
  });

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  /* SOUNDCLOUD AUTH ROUTES */
  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  app.get('/auth/soundcloud',
    passport.authenticate('soundcloud'));

  // On user interaction with soundcloud login, redirected back to here
  app.get('/auth/soundcloud/callback', function (req,res,next){
    passport.authenticate('soundcloud',{ failureRedirect: "/login" },
    function (err, user){
      if (user){
        req.logIn(user, function(err){
          if (err) {next(err)};
        });
      }
      res.redirect('/#/songs');

    })(req,res,next);
  });
  
};