const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');

/*
	Serializing and Deserializing is about use of cookies, to grant a quicker access
*/

// Serializing users that is uniquely identifying with MongoDB assigned 'id'
passport.serializeUser((user, done) => {

	// Null for no error
	done(null, user.id);
});

// Deserializing user
passport.deserializeUser((id, done) => {
	User.findById(id).then((user) => {
		done(null, user);
	});
});

// Using passport to use Google Startegy
passport.use(
	new GoogleStrategy({
		// Google strategy options
		
		// Redirect URI i.e where the user must be redirected after successful Google login
		callbackURL: '/auth/google/redirect',

		clientID: keys.google.clientID,
		clientSecret: keys.google.clientSecret
	},(accessToken, refreshToken, profile, done)=>{
		// passport callback function
		/*
			accessToken - from google granting access
			refreshToken - to refresh the accessToken
			profile - profile info about the user
			done - function when all correct.
		*/
		console.log('Passport callback function fired.'); 
		console.log(profile);

		// Search for existing users (if any)
		User.findOne({googleId: profile.id}).then((currentUser) => {
			if(currentUser){

				// User found in db
				console.log('Found existing user ', currentUser);
				done(null, currentUser);
			} else {

				// Creating new user for database from Google Sign-in
				new User ({

					/* 
						the values .displayName and .id are taken from what
						gets returned by google as JSON
					*/ 
					googleId: profile.id,
                    username: profile.displayName,
                    thumbnail: profile._json.picture
				}).save().then((newUser) => {

					// then executes after .save() promise is executed
					console.log('New user created' + newUser);
					done(null, newUser);
				});
			}
		});
	})
)