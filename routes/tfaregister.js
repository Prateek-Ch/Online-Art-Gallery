require('dotenv').config();

var express = require('express');
var tfaregister = express.Router();
const authy = require('authy')(process.env.AUTHY_KEY);
var passport = require('passport');
const User = require('../models/user');

// TO GET tfaregister PAGE (this or app)
tfaregister.get('/',function(req,res,next){
  res.render('tfaregister');
})

tfaregister.post('/register', function(req, res) {

	var isSuccessful = false;
	var email = req.user.email;
	var phone = req.body.authy_cellphone;
	var countryCode = req.body.authy_countries;

	authy.register_user(email, phone, countryCode, function (regErr, regRes) {
    	console.log('In Registration...');
    	if (regErr) {
       		console.log(regErr);
       		res.send('There was some error registering the user.');
    	} else if (regRes) {
    		console.log(regRes);
        req.session.authy_id = regRes.user.id;
        authy.request_sms(regRes.user.id, function (smsErr, smsRes) {
    			console.log('Requesting SMS...');
    			if (smsErr) {
    				console.log(smsErr);
    				res.send('There was some error sending OTP to cell phone.');
    			} else if (smsRes) {
    				console.log(smsRes);
    				res.redirect('/tfaverify');
    			}
			});
    	}
   	});
});

module.exports = tfaregister;
