var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
  name: String,
  email: String
});


var Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
