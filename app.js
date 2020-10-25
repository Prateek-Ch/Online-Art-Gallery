require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const mongoose = require("mongoose");
const ejs = require("ejs");
var LocalStrategy = require('passport-local');

var cookieParser = require('cookie-parser');
const app = express();

const multer = require('multer');
//Integrating Stripe here
var Publishable_Key = 'Your_Publishable_Key'

const stripe = require('stripe');

//Setting up various routes
var homepage = require('./routes/index');
var dashboard = require('./routes/dashboard');
var about = require('./routes/about');
var userRoutes = require('./routes/user');
var blog = require('./routes/blog');
// var auth = require('./routes/auth');
var tfaregister = require('./routes/tfaregister');
var tfaverify = require('./routes/tfaverify');
var otp = require('./routes/otp');

var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session)


mongoose.connect('mongodb://localhost:27017/paints',{ useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false});
require('./config/passport')(passport);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(validator());
app.use(cookieParser());
app.use(express.static("public"));

app.use(session({secret: 'thisismysecret',
resave: false,
saveUninitialized:false,
store: new MongoStore({ mongooseConnection: mongoose.connection})
}));


app.use(function(req, res, next) {
   req.session.cookie.maxAge = 180 * 60 * 1000; //Change session expiration milliseconds
    next();
});

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//TO get this login variable to be used in views
app.use(function(req,res,next){
  res.locals.login = req.isAuthenticated();  //Will be either true or false
  res.locals.session = req.session;
  next();
})


app.use('/Dashboard',dashboard);
app.use('/About',about);
app.use('/Blog',blog);
app.use('/user',userRoutes);
app.use('/tfaregister',tfaregister);
app.use('/tfaverify',tfaverify);
app.use('/otp',otp);
app.use('/',homepage);


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
