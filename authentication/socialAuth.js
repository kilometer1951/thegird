const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const Users = require("../models/Users");
const config = require("../config/secret");
const authFunctions = require("../functions/authfunctions");



passport.serializeUser(function(user, next) {
    next(null, user.id)
});

passport.deserializeUser(function(id, next) {
   Users.findById(id, function(err, user) {
       next(err, user);
   });
});





/* Sign in / log in using facebook */
passport.use(new FacebookStrategy({
  clientID: config.facebookClientID,
  clientSecret: config.facebookClientSecret,
  callbackURL: 'https://thegrid93.herokuapp.com/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name']
}, function(accessToken, refreshToken, profile, next) {
    Users.findOne({ email: profile._json.email }, function(err, user) {
      if (user) {
        return next(err, user);
      } else {
        var newUser = new Users();
        newUser.email = profile._json.email;
        newUser.facebookId = profile.id;
        newUser.name = profile.displayName;
        newUser.first_name = profile.name.givenName ;
        newUser.last_name = profile.name.familyName;
        newUser.username = authFunctions.removeWhiteSpace(profile.name.givenName + '.' + profile.name.familyName).toLowerCase();
        newUser.photo = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
        newUser.save(function(err) {
          if (err) throw err;
          next(err, newUser);
        });
      }
    });
}));


/* Sign in / log in using google */
passport.use(new GoogleStrategy({
  clientID: config.googleClientID,
  clientSecret: config.googleClientSecert,
  callbackURL: 'https://thegrid93.herokuapp.com/auth/google/callback',
}, function(accessToken, refreshToken, profile, next) {
    Users.findOne({ email: profile.emails[0].value }, function(err, user) {
      if (user) {
        return next(err, user);
      } else {
        var newUser = new Users();
        newUser.email = profile.emails[0].value;
        newUser.googleId = profile.id;
        newUser.name = profile.displayName;
        newUser.first_name = profile.name.givenName;
        newUser.last_name = profile.name.familyName;
        newUser.username = authFunctions.removeWhiteSpace(profile.name.givenName + '.' + profile.name.familyName).toLowerCase();
        newUser.photo = profile._json.image.url;
        newUser.save(function(err) {
          if (err)  throw err;
         return next(err, newUser);
        });
      }
    });
}));
