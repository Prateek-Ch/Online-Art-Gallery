var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
  user: {type: Schema.Types.ObjectID, ref: 'User'},
  cart: {type: Object, required: true},
  address: {type: String,required: true},
  address_two: {type: String,required: true},
  zip: {type:String,required: true},
  email:{type: String,required: true},
  name: {type: String,required: true},
  phone: {type: String,required: true}
  });

module.exports = mongoose.model("order",schema);
