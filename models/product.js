var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
	name: String,
	desc: String,
	img:
	{
		data: Buffer,
		contentType: String
	} ,
  price: {type:Number, required: true},
});

module.exports = mongoose.model("product",schema);
