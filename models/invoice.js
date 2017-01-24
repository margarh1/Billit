var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InvoiceSchema = new Schema({
  title: String,
  number: String,
  date: String,
  status: String,
  description: String,
  quantity: Number,
  rate: Number,
  totalAmount: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

var Invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = Invoice;
