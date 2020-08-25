const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const mongoose = require("mongoose");
const ejs = require("ejs");
var LocalStrategy = require("passport-local");

//Setting up various routes
var homepage = require('./routes/index');
var dashboard = require('./routes/dashboard');
var about = require('./routes/about');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');

const app = express();

mongoose.connect('mongodb://localhost:27017/paints',{ useNewUrlParser: true, useUnifiedTopology: true});
require('./config/passport');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));
app.use(session({secret: 'thisismysecret',resave: false, saveUninitialized:false}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use('/',homepage);
app.use('/Dashboard',dashboard);
app.use('/About',about);





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
