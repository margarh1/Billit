var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/billit");

var Invoice = require('./invoice');
var Customer = require('./customer');
var User = require('./user');

module.exports.Invoice = Invoice;
module.exports.Customer = Customer;
module.exports.User = User;
