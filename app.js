const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// const mongoose = require("mongoose");
const ejs = require("ejs");
var LocalStrategy = require("passport-local");

var cookieParser = require('cookie-parser');
const app = express();
//Integrating Stripe here
var Publishable_Key = 'Your_Publishable_Key'
var Secret_Key = 'Your_Secret_Key'

const stripe = require('stripe')(Secret_Key)
//const link = await stripe.accounts.createLoginLink('{{CONNECTED_STRIPE_ACCOUNT_ID}}');
//Setting up various routes
var homepage = require('./routes/index');
var dashboard = require('./routes/dashboard');
var about = require('./routes/about');
var userRoutes = require('./routes/user');

//var Checkout = require('./routes')

var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session)


mongoose.connect('mongodb://localhost:27017/paints',{ useNewUrlParser: true, useUnifiedTopology: true});
require('./config/passport')(passport);

// View Engine Setup 
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.get('/', function(req, res){ 
    //res.render('Home', { 
       //key: Publishable_Key 
    //}) 
//})
app.post('/payment', function(req, res){ 
  
    // Moreover you can take more details from user 
    // like Address, Name, etc from form 
    stripe.customers.create({ 
        email: req.body.stripeEmail, 
        source: req.body.stripeToken, 
        name: 'Gourav Hammad', 
        address: { 
            line1: 'TC 9/4 Old MES colony', 
            postal_code: '452331', 
            city: 'Indore', 
            state: 'Madhya Pradesh', 
            country: 'India', 
        } 
    }) 
    .then((customer) => { 
  
        return stripe.charges.create({ 
            amount: 2500,     // Charging Rs 25 
            description: 'Web Development Product', 
            currency: 'INR', 
            customer: customer.id 
        }); 
    }) 
    .then((charge) => { 
        res.send("Success")  // If no error occurs 
    }) 
    .catch((err) => { 
        res.send(err)       // If some error occurs 
    }); 
})

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
app.use('/user',userRoutes);
app.use('/',homepage);
//app.use('/Checkout',Checkout)


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
