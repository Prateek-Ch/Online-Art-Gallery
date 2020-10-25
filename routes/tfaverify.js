require('dotenv').config();

var express = require('express');
var tfaverify = express.Router();
const authy = require('authy')(process.env.AUTHY_KEY);
const mongoose = require("mongoose");
const User = require('../models/user');
var passport = require('passport');

mongoose.connect('mongodb://localhost:27017/paints',{ useNewUrlParser: true, useUnifiedTopology: true})

tfaverify.get('/',function(req,res){
  res.render('tfaverify');
});

tfaverify.post('/verify', function(req, res) {
	console.log('New verify request...');
console.log(req.user.auth_id);
	var id = req.session.authy_id
	var token = req.body.authy_token;

	authy.verify(id, token, function (verifyErr, verifyRes) {
		console.log('In Verification...');
		if (verifyErr) {
			console.log(verifyErr);
			res.send('OTP verification failed.');
		} else if (verifyRes) {
			console.log(verifyRes);
			res.render('tfaconfirm');
		}
	});

  var query = {'email': req.user.email};

  User.findOneAndUpdate(query, {$set: {auth_id: req.session.authy_id}}, {upsert: true}, function(err, doc) {
      if (err) return res.send(500, {error: err});
      else console.log('Succesfully saved.');
  });


});


module.exports = tfaverify;
