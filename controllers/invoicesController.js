var db = require('../models');

function index(req, res) {
  db.Invoice.find({}, function(err, allInvoices) {
    res.json(allInvoices);
  });
}
