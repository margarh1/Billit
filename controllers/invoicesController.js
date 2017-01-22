var db = require('../models');

function index(req, res) {
  db.Invoice.find({}, function(err, allInvoices) {
    res.json(allInvoices);
  });
}

function create(req, res) {
  console.log("created successful");
  console.log('body', req.body);

  db.Invoice.create(req.body, function(err, invoice) {
    if (err) { console.log('error', err); }
    console.log(invoice);
    res.json(invoice);
  });
}

module.exports = {
  index: index,
  create: create
};
