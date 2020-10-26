var express = require('express');
var router = express.Router();

var Product = require('../models/product');

// TO GET HOME PAGE (this or app)
router.get('/',function(req,res,next){
  var noMatch = '';
if(req.query.search){
  const regex = new RegExp(escapeRegex(req.query.search), 'gi');
  var products = Product.find({title: regex},(err,data)=>{
    if(err){throw err;}
    else{
      if(data.length<1){
        noMatch = "No Painting with this name is found, please try again";
      }
      res.render('Home',{products:data, noMatch:noMatch});
    }
    });
}
  else{
  var products = Product.find({},(err,data)=>{
    if(err){throw err;}
    res.render('Home',{products:data, noMatch:noMatch});
});
}
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;
