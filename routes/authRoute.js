const router = require("express").Router();
const Users = require("../models/Users");
const passport = require("passport");
const localAuth = require("../authentication/localAuth");
const socialAuth = require("../authentication/socialAuth");
const authFunctions = require("../functions/authfunctions");

//SHOW SIGNUP PAGE
router.get("/signup", function(req, res){
   if(req.user) {
       res.redirect('/');
   } else {
       res.render("desktop/landing", {layout: false, error: req.flash('errors') }); 
   }
});


//POST SIGNUP DATA TO DB
router.post("/signup", function(req, res, next) {
    // heck if user already exist
    Users.findOne({ email: req.body.email }, function(err, existingUser) {
        if(existingUser) {
            //if user exist redirect to login page
            req.flash('errors', 'Account with that email already exist');
            res.redirect('/signup');
        } else {
            //user does not exist save and authenticate user
            var newUser = new Users();
            newUser.first_name = authFunctions.capitalize(req.body.fname);
            newUser.last_name = authFunctions.capitalize(req.body.lname);
            newUser.username = authFunctions.removeWhiteSpace(req.body.fname + '.' + req.body.lname).toLowerCase();
            newUser.email = req.body.email;
            newUser.password = newUser.encryptPassword(req.body.password);
            newUser.save(function(err){
                //log the user in after you save
                req.logIn(newUser, function(err){
                    if(err){
                        console.log(err);
                        return next(err);
                    } else {
                        res.redirect('/');
                    } 
                    
                });
            });
        }
    });
});


router.get("/login", function(req, res){
   if(req.user) {
       return res.redirect('/');
   } else {
       return res.render("desktop/login", {layout: false, error: req.flash('errors') }); 
   }
});


router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

//social auth

//facebook auth
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile,email,user_friends'] }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
 }));
//end facebook auth



//google auth
 router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

 router.get('/auth/google/callback', passport.authenticate('google', {
   successRedirect: '/',
   failureRedirect: '/login',
   failureFlash: true
  }));
//end google auth

//end social auth



//logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});


module.exports = router;