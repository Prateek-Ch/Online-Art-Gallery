var express = require('express');
var router = express.Router();

var Cart = require('../models/cart');
var Product = require('../models/product');


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


module.exports = router;
