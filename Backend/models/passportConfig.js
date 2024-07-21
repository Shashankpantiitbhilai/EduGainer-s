const passport = require("passport");
const LocalStrategy = require("passport-local");
const dotenv = require("dotenv");
const { User } = require("./student");

// Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    User.authenticate(),
  ),
);


const GoogleStrategy = require('passport-google-oauth20').Strategy;

dotenv.config();

const callbackURL =
    process.env.NODE_ENV === 'production'
        ? `${process.env.FRONTEND_PROD}/auth/google/callback`
        : `${process.env.FRONTEND_DEV}/auth/google/callback`

// console.log(callbackURL);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            let user = await User.findOne({ googleId: profile.id });

            if (!user) {
                // If the user is not found, create a new one
                user = new User({
                    googleId: profile.id,
                    username: profile.displayName,
                    email: profile.emails[0].value // assuming the user has a single email
                });
                await user.save();
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));


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
