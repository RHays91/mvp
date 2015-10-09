module.exports = {
  port : process.env.PORT || 8000,
  passport: {
    soundcloud: {
      clientID: process.env.SOUNDCLOUD_CLIENT_ID,
      clientSecret: process.env.SOUNDCLOUD_CLIENT_SECRET,
      callbackURL: process.env.SOUNDCLOUD_CALLBACK_URL
    }
  },
  db: {
    host: process.env.DB_HOST
  },
  sessionSecret: process.env.SESSION_SECRET
};