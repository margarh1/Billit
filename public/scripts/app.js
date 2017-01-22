angular
  .module('billit', [])
  .controller('InvoicesIndexController', InvoicesIndexController);

  InvoicesIndexController.$inject = ['$http'];
  function InvoicesIndexController($http){
    var vm = this;
    vm.newInvoice = {};

    vm.newInvoice = {
      // title: 'Kitchen remodel',
      // number: 'P2456Z',
      // date: '1/1/2017',
      // status: 'Paid',
      // totalAmount: 10000
    };

    vm.invoices = [];
    $http({
      method: 'GET',
      url: '/api/invoices'
    }).then(function successCallback(response) {
      console.log("response successful");
      vm.invoices = response.data;
    }, function errorCallback(response) {
      console.log('There was an error getting the data', response);
    });

    vm.createInvoice = function () {
    $http({
     method: 'POST',
     url: '/api/invoices',
     data: vm.newInvoice,
    }).then(function successCallback(response) {
     console.log("post works");
     vm.invoices.push(response.data);
    }, function errorCallback(response) {
     console.log('There was an error posting the data', response);
    });
    }
  }
