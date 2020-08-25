var express = require('express');
var dashboard = express.Router();

// TO GET Dashboard PAGE (this or app)
dashboard.get('/',function(req,res,next){
  res.render('Dashboard')
})

module.exports = dashboard;
