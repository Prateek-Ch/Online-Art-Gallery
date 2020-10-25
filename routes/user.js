var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/dashboard', isLoggedIn , function(req,res){
  res.render('dashboard')
})

router.get('/logout',isLoggedIn ,function(req,res){
  req.session.destroy(function(err){
        if(err){
            console.log(err);
        }
        else
        {
            res.redirect('/');
        };
})
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
  failureRedirect: "/signup",
  failureFlash: true
}));

router.get('/signin',function(req,res,next){
  var messages = req.flash('error');
  res.render('user/signin',{csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin',{
  failureRedirect: "/signin",
  failureFlash: true
}),(req,res)=>{
  if(req.user.auth_id){
    res.redirect('/otp');
    return;
  }
  else res.redirect('/Dashboard');
}

);

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
