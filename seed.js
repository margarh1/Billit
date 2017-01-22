var db = require("./models");

var invoiceList = [];

invoiceList.push({
              title: 'Website Development',
              number: 'K6790Y8',
              date: '1/1/2017',
              status: 'Paid',
              totalAmount: 5000
            });
invoiceList.push({
              title: 'Wedding Phtotos',
              number: 'U68864C',
              date: '1/1/2017',
              status: 'Pending',
              totalAmount: 3000
            });
invoiceList.push({
              title: 'Logo Design',
              number: 'K7996W830',
              date: '1/1/2017',
              status: 'Paid',
              totalAmount: 500
            });

// invoiceList.forEach(function(invoice) {
// });

db.Invoice.remove({}, function(err, invoices){

  db.Invoice.create(invoiceList, function(err, invoices){
    if (err) { return console.log('ERROR', err); }
    console.log("all invoices:", invoices);
    console.log("created", invoices.length, "invoices");
    process.exit();
  });
});
