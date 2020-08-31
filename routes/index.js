var express = require('express');
var router = express.Router();

var Product = require('../models/product');

// TO GET HOME PAGE (this or app)
router.get('/',function(req,res,next){
  var products = Product.find({},(err,data)=>{
    if(err){throw err;}
    res.render('Home',{products:data});
  });
  });

module.exports = router;
