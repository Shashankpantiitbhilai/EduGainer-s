const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require("dotenv");
const { User } = require("./student");

dotenv.config();

// Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    User.authenticate()
  )
);

const callbackURL =
  process.env.NODE_ENV === 'production'
    ? `${process.env.BACKEND_PROD}/auth/google/callback`
    : `${process.env.BACKEND_DEV}/auth/google/callback`;

// console.log(callbackURL)
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: callbackURL
},

  async function (accessToken, refreshToken, profile, done) {
    try {
      // First, try to find a user with the Google ID
      let user = await User.findOne({ googleId: profile.id });
   
      // If not found by Google ID, try to find by email
      if (!user) {
        user = await User.findOne({ username: profile.emails[0].value });
      
      }

      if (user) {
        // If user exists (either by Google ID or email), update the Google ID if necessary
        if (!user.googleId) {
          user.googleId = profile.id;
          user.strategy = 'google';
         
          await user.save();
        }
      } else {
      
        // If user doesn't exist, create a new one
        user = new User({
          googleId: profile.id,
          username: profile.emails[0].value,
          strategy: 'google'
        });
     
        await user.save();
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (userKey, done) => {
  try {
    let user = await User.findById(userKey._id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;