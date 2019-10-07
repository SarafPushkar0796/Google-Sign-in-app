// This file holds all the authentication routes of the application

const router = require('express').Router();
const passport = require('passport');

// Auth login route
router.get('/login',(req,res)=>{

	// render your login page
	res.render('login');
});

// Auth logout
router.get('/logout',(req,res)=>{
	req.logout();
	res.redirect('/');
});

// Authenticates google strategy in 'passport-setup.js' file
router.get('/google',passport.authenticate('google',{

	// Scope as to which data the app wants to access
	scope: ['profile']
}));

// Redirect URI handler
router.get('/google/redirect', passport.authenticate('google'), (req,res)=>{
	// res.send(req.user);
	res.redirect('/profile/');
});

/* 
	Exporting this 'module' to make this available globally
	use 'import' in other files
*/
module.exports = router;