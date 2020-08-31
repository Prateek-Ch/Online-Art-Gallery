var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/dashboard', isLoggedIn , function(req,res){
  res.render('dashboard')
})

router.get('/user/logout',isLoggedIn ,function(req,res){
  req.logout();
  res.redirect('/');
})

router.use('/', notLoggedIn, function(req,res,next){
  next();
});

router.get('/signup',function(req,res,next){
  var messages = req.flash('error');
  res.render('user/signup',{csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup',{
  successRedirect: "/dashboard",
  failureRedirect: "/user/signup",
  failureFlash: true
}));

router.get('/signin',function(req,res,next){
  var messages = req.flash('error');
  res.render('user/signin',{csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin',{
  successRedirect: "/dashboard",
  failureRedirect: "/user/signin",
  failureFlash: true
}));

module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next){
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
