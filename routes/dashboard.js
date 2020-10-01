var express = require('express');
var router = express.Router();

var Cart = require('../models/cart');
var Product = require('../models/product');
var Order = require('../models/order');

const stripe = require('stripe')('sk_test_51HU6ZPEwBXNHMSwOSsCuOCbeDAdILiSvcYy8IzwveP4nvw9zhw17BWNvjL6GF3lLipTTGx18RP3rdAZv54ZOucgN00EK6WJcKm');
// TO GET Dashboard PAGE (this or app)
router.get('/',function(req,res,next){
 if(!req.session.cart){
    return res.render('Dashboard',{products: null, name:req.user.name, email:req.user.email});
 }
 var cart = new Cart(req.session.cart);
 res.render('Dashboard',{products: cart.generateArray(), totalPrice: cart.totalPrice, name:req.user.name, email:req.user.email});
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

router.get('/reduce/:id',function(req,res){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceOne(productId);
  req.session.cart = cart;
  res.redirect('/Dashboard');
})

router.get('/removeAll/:id',function(req,res){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeAll(productId);
  req.session.cart = cart;
  res.redirect('/Dashboard');
})


router.post('/charge', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/');
    }
    var cart = new Cart(req.session.cart ? req.session.cart : {});
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
  .then(charge =>
   res.redirect('/')
     );

      var order = new Order({
       user: req.user, //Tried from Passport
       cart: cart,
       phone:req.body.phone,
       address: req.body.address,
       address_two:req.body.address_two,
       zip: req.body.zip,
       email: req.body.email,
       name: req.body.name,

      });
      order.save(function(err,result){
         if(err) console.log(err);
      });
     req.session.cart = null;

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
