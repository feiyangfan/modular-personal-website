const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

function validPassword(password, real) {
  return real === password;
}
module.exports = function (passport) {
  passport.use(
    new LocalStrategy(function (username, password, done) {
      console.log(username, password);
      User.findOne({ username: username }, function (err, user) {
        console.log(user);
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        const isValid = validPassword(password, user.password);
        if (isValid) {
          console.log("Signed in");
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      if (err) {
        return done(err);
      }
      done(null, user);
    });
  });
};
