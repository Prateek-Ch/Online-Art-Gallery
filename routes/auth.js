// require('dotenv').config();
//
// var express = require('express');
// var auth = express.Router();
// const passport = require("passport");
//
// const findOrCreate = require('mongoose-findorcreate');
//
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
//
// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });
//
// passport.deserializeUser((id, done) => {
//     User.findById(id, (err, user) => {
//         done(err, user);
//     });
// });
//
// //Google SignIn
// passport.use(new GoogleStrategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/google/dashboard",
//     userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//       User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));
//
// // TO GET About PAGE (this or app)
// auth.get('/auth/google',function(req,res,next){
//   passport.authenticate('google', { scope: ["profile"] })
// });
//
// auth.get("/auth/google/dashboard",
//   passport.authenticate('google', { failureRedirect: '/user/login' }),
//   function(req, res) {
//     // Successful authentication, redirect dashboard? page.
//     res.redirect('/Dashboard');
//   });
//
// module.exports = auth;
