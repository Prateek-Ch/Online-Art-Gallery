var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var User = require('../models/user');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use('local-signup', new LocalStrategy({
usernameField : 'username',
passwordField : 'password',
passReqToCallback : true
},
function(req, username, password, done, name){
// asynchronous
// User.findOne wont fire unless data is sent back
process.nextTick(function() {
User.findOne({ 'local.username' : username }, function(err, user) {
if (err)
{return done(err)};
if (user) {
return done(null, false, {message:'That username is already taken.'});
} else {
// if there is no user with that email
// create the user
var newUser = new User();
// set the user's local credentials
newUser.name = name;
newUser.email = email;
newUser.password = newUser.generateHash(password);
// save the user
newUser.save(function(err) {
if (err)
throw err;
return done(null, newUser);
});
}});
});
}));
