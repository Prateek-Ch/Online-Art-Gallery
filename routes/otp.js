var express = require('express');
var otp = express.Router();
const authy = require('authy')('WLzOJvB6BDODi3uOA9Nm39KElYxqHiUL');

otp.get('/',function(req,res){
  res.render('otp');
    console.log('New verify request...');
    console.log(req.user.auth_id);
  	const id = req.user.auth_id;

    authy.request_sms(id, function (smsErr, smsRes) {
      console.log('Requesting SMS...');
      if (smsErr) {
        console.log(smsErr);
        res.send('There was some error sending OTP to cell phone.');
        return;
      } else if (smsRes) {
        console.log(smsRes);
        return;
      }
  });

});


otp.post('/verification',function(req,res){
  const id = req.user.auth_id;
  const token = req.body.auth_token;

  authy.verify(id, token, function (verifyErr, verifyRes) {
  console.log('In Verification...');
  if (verifyErr) {
    console.log(verifyErr);
    res.send('OTP verification failed.');
    return;
  }
if (verifyRes) {
    console.log(verifyRes);
    res.redirect('/Dashboard');
    return;
  }
});
})

module.exports = otp;
