var db = require('../models');

function index(req, res) {
  db.Invoice.find({}, function(err, allInvoices) {
    res.json(allInvoices);
  });
}

function create(req, res) {
  console.log("created successful");
  // db.Invoice.create(req.body, function(err, invoice) {
  //   if (err) { console.log('error', err); }
  //   console.log(invoice);
  //   res.json(invoice);
  // });
}

function show(req, res) {
  db.Invoice.findById(req.params.invoiceId, function(err, foundInvoice) {
    if(err) { console.log('invoicesController.show error', err); }
    console.log('invoicesController.show responding with', foundInvoice;
    res.json(foundInvoice);
  });
}

function destroy(req, res) {
  db.Invoice.findOneAndRemove({ _id: req.params.invoiceId }, function(err, foundInvoice){
    res.json(foundInvoice);
  });
}

module.exports = {
  index: index,
  create: create,
  destroy: destroy
};
