var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Product = require('../models/product');

var csrfProtection = csrf();
router.use(csrfProtection);

// TO GET HOME PAGE (this or app)
router.get('/',function(req,res,next){
  var products = Product.find({},(err,data)=>{
    if(err){throw err;}
    res.render('Home',{products:data});
  });
  });

router.get('/user/signup',function(req,res,next){
  var messages = req.flash('error');
  res.render('user/signup',{csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/user/signup', passport.authenticate('local.signup',{
  successRedirect: "/dashboard",
  failureRedirect: "/user/signup",
  failureFlash: true
}));

router.get('/dashboard',function(req,res){
  res.render('dashboard')
})

module.exports = router;
