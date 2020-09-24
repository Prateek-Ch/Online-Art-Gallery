var express = require('express');
var router = express.Router();

var Cart = require('../models/cart');
var Product = require('../models/product');

const stripe = require('stripe')('sk_test_51HU6ZPEwBXNHMSwOSsCuOCbeDAdILiSvcYy8IzwveP4nvw9zhw17BWNvjL6GF3lLipTTGx18RP3rdAZv54ZOucgN00EK6WJcKm');
// TO GET Dashboard PAGE (this or app)
router.get('/',function(req,res,next){
 if(!req.session.cart){
   return res.render('Dashboard',{products: null});
 }
 var cart = new Cart(req.session.cart);
 res.render('Dashboard',{products: cart.generateArray(), totalPrice: cart.totalPrice});
});


router.get('/checkout', function(req,res){
  if(!req.session.cart){
    return res.redirect('/');
  }
  var cart = new Cart(req.session.cart);
  res.render('Checkout',{products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/add-to-cart/:id', function(req,res){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product){
    if(err){
       return res.redirect('/');
  }
   cart.add(product, product.id);
   req.session.cart = cart;
   console.log(req.session.cart);
   res.redirect('/');
  });
});


router.post('/charge', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    console.log(req.body);
    const amount = cart.totalPrice*100;

 stripe.customers.create({
   email: req.body.stripeEmail,
   source: req.body.stripeToken
 })
 .then(customer => stripe.charges.create({
   amount,
   description: 'Painting',
   currency: 'inr',
   customer: customer.id
 }))
 .then(charge => res.redirect('/'));
});



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
