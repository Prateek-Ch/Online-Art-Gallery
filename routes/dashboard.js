require('dotenv').config();

var express = require('express');
var router = express.Router();

var Cart = require('../models/cart');
var Product = require('../models/product');
var Order = require('../models/order');

const stripe = require('stripe')(process.env.STRIPE_KEY);

//IMAGE UPLOAD PART1 STARTS
//step5
var multer = require("multer");
var fs = require("fs");
var path = require("path");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "routes/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

//step6
var imgModel = require("../models/product.js");

// TO GET Dashboard PAGE (this or app)
router.get('/',function(req,res,next){
 if(!req.session.cart){
    return res.render('Dashboard',{products: null, name:req.user.name, email:req.user.email,phone:req.user.phone,description:req.user.description});
 }
 var cart = new Cart(req.session.cart);
 res.render('Dashboard',{products: cart.generateArray(), totalPrice: cart.totalPrice, name:req.user.name, email:req.user.email,phone:req.user.phone,description:req.user.description});
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

//IMAGE UPLOAD PART2 STARTS
//image
router.get('/upload',function(req,res){
  res.render('upload');
})

router.post("/imagehandle", upload.single("image"), (req, res, next) => {
  var obj = {
    artist_name:req.user.name,
    artist_phone:req.user.phone,
    artist_email:req.user.email,
    artist_description:req.user.description,
    title: req.body.title,
    desc: req.body.desc,
    price: req.body.price,
    img: {
      data: fs.readFileSync(
        path.join(__dirname + "/uploads/" + req.file.filename)
      ),
      contentType: "image/png",
    },
  };
  imgModel.create(obj, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      // item.save();
      res.redirect("/");
    }
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
