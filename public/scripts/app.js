console.log("app.js connected");

angular
  .module('billit', [])
  .controller('InvoicesIndexController', InvoicesIndexController);

  function InvoicesIndexController(){
    var vm = this;
    vm.newInvoice = {};

    vm.newInvoice = {
      title: 'Kitchen remodel',
      number: 'P2456Z',
      date: '1/1/2017',
      status: 'Paid',
      totalAmount: 10000
    };

    vm.invoices = [
      {
        title: 'Website Development',
        number: 'K6790Y8',
        date: '1/1/2017',
        status: 'Paid',
        totalAmount: 5000
      },
      {
        title: 'Wedding Phtotos',
        number: 'U68864C',
        date: '1/1/2017',
        status: 'Pending',
        totalAmount: 3000
      },
      {
        title: 'Logo Design',
        number: 'K7996W830',
        date: '1/1/2017',
        status: 'Paid',
        totalAmount: 500
      }
    ];
  }
