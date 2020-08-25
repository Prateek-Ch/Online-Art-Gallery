var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/paints',{ useNewUrlParser: true, useUnifiedTopology: true})

var products = [

  new Product({
  imagePath:'https://i.pinimg.com/originals/1c/c1/d9/1cc1d9be2d88443f1a4bb706c776dfe2.jpg',
  title:"goodtitle",
  description:"Hello to our lil description",
  price:"50",
}),

 new Product({
  imagePath:"https://cdn11.bigcommerce.com/s-x49po/products/36688/images/49940/1546696172808_BIRD__2___81386.1547010637.500.659.jpg?c=2",
  title:"goodtitle",
  description:"Hello to our lil description",
  price:"100",
}),

 new Product({
  imagePath:"https://cdn11.bigcommerce.com/s-x49po/products/15685/images/27040/1474221788049_La_Femme_1__74566.1474347186.500.659.png?c=2",
  title:"goodtitle",
  description:"Hello to our lil description",
  price:"150",
}),

new Product({
  imagePath:"https://www.qiqiart.com/media/catalog/product/cache/2/image/600x/17f82f742ffe127f42dca9de82fb58b1/v/e/verticalminimalartmn263b.jpg",
  title:"goodtitle",
  description:"Hello to our lil description",
  price:"5000",
}),
];

//To save it in mongoose in mongo collection
var done = 0;
for (var i = 0; i<products.length; i++){
  products[i].save(function(err,result){
    done++;
    if(done===products.length){
      exit();
    }
  });
}

function exit(){
  mongoose.disconnect();
}
