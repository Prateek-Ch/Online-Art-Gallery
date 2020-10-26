var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
	artist_name:{type:String, required: true},
	artist_phone:{type:String, required: true},
	artist_email:{type:String, required: true},
	artist_description:{type:String, required: true},
	title: {type:String, required: true},
	desc: {type:String, required: true},
	img:
	{
		data: Buffer,
		contentType: String
	} ,
  price: {type:Number, required: true},
});

module.exports = mongoose.model("product",schema);
