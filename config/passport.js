const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});


module.exports = function(passport){
  passport.use('local.signup', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
  }, (req, email, password, done) => {
        User.findOne({'email': email}, (err, user) => {
         if(err){
             return done(err);
         }

          if(user){
              return done(null, false, req.flash('error', 'Username is already taken.'));
          }

          const newUser = new User();
          newUser.name = req.body.name;
          newUser.phone = req.body.phone;
          newUser.email = req.body.email;
          newUser.password = newUser.encryptPassword(req.body.password);
          newUser.description = req.body.artist_desc;
          newUser.auth_id = 0;

          newUser.save((err) => {
                if(err){
                  return done(err);
                }
              done(null, newUser);
          });
      });
      }));


      //SignIn
      passport.use('local.signin', new LocalStrategy({
          usernameField: 'email',
          passwordField: 'password',
          passReqToCallback: true
      }, (req, email, password, done) => {
            User.findOne({'email': email}, (err, user) => {
             if(err){
                 return done(err);
             }

              if(!user){
                  return done(null, false, req.flash('error', 'Invalid Email Address'));
              }
              if(!user.validPassword(password)){
                          return done(null, false, req.flash('error', 'Invalid Password'));
                      }
              return done(null, user);
              });
          }));


}
