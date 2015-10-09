var morgan            = require('morgan'),
    bodyParser        = require('body-parser'),
    session           = require('express-session'),
    helpers           = require('./helpers'),
    passport          = require('passport');

module.exports = function (app, express) {

  // Routers
  var songRouter = express.Router({mergeParams: true});
  var userRouter = express.Router({mergeParams: true});

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  // set up sessions and initialize passport
  app.use(session({
    secret: app.config.sessionSecret,
    cookie: {expires: false} 
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  // files in /client/public/ will be served as static assets
  app.use(express.static(__dirname + '/../public/'));

  // restricts access to protected resources when request is not authenticated via passport
  // and mobile user not present in request headers
  var isAuth = function (req, res, next){
    if (!req.isAuthenticated()){
      res.send(401);
    } else {
      next();
    }
  };

  app.use('/user', userRouter);
  
  app.use('/songs/', isAuth, songRouter);
  app.use('/songs/:songId/', isAuth, songRouter);

  //use error handling methods from helpers
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  //attach routes to routers
  require('../modules/user/userRoutes')(userRouter);
  require('../modules/song/songRoutes')(songRouter);
  require('../modules/auth/authRoutes')(app, passport);

};