var db = require('../models');

// function index(req, res) {
//   db.Invoice.find({}, function(err, allInvoices) {
//     res.json(allInvoices);
//   });
// }

// function create(req, res) {
//   console.log("created successful");
  // db.Invoice.create(req.body, function(err, invoice) {
  //   if (err) { console.log('error', err); }
  //   console.log(invoice);
  //   res.json(invoice);
  // });
// }

function show(req, res) {
  db.User.findById(req.params.userId, function(err, foundUser) {
    if(err) { console.log('userController.show error', err); }
    console.log('usersController.show responding with', foundUser;
    res.json(foundUser);
  });
}

// function destroy(req, res) {
//   db.Invoice.findOneAndRemove({ _id: req.params.invoiceId }, function(err, foundInvoice){
//     res.json(foundInvoice);
//   });
// }

// function update(req, res) {
//   console.log('updating with data', req.body);
//   db.Invoice.findById(req.params.invoiceId, function(err, foundInvoice) {
//     if(err) { console.log('invoicesController.update error', err); }
//     foundInvoice.title = req.body.title;
//     foundInvoice.number = req.body.number;
//     foundInvoice.save(function(err, savedInvoice) {
//       if(err) { console.log('saving altered invoice failed'); }
//       res.json(savedInvoice);
//     });
//   });
// }

module.exports = {
 show: show
};
