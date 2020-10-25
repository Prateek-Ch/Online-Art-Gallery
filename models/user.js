const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

const findOrCreate = require('mongoose-findorcreate');

var userSchema = new Schema({
  name: {type: String, required: true},
  email : {type: String, required: true},
  password: {type: String, required: true},
  phone: {type: Number, required: true},
  description: {type: String},
  auth_id: {type: Number}
});

userSchema.methods.encryptPassword = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('user', userSchema);
