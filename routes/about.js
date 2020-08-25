var express = require('express');
var about = express.Router();

// TO GET About PAGE (this or app)
about.get('/',function(req,res,next){
  res.render('About')
})

module.exports = about;
