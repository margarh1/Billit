angular
  .module('billit', [])
  .controller('InvoicesIndexController', InvoicesIndexController);

  InvoicesIndexController.$inject = ['$http'];
  function InvoicesIndexController($http){
    var vm = this;
    vm.newInvoice = {};


    vm.invoices = [];
    $http({
      method: 'GET',
      url: '/api/invoices'
    }).then(function successCallback(response) {
      console.log("response of seed invoices successful");
      vm.invoices = response.data;
    }, function errorCallback(response) {
      console.log('There was an error getting the data', response);
    });

    vm.createInvoice = function () {
    $http({
     method: 'POST',
     url: '/api/invoices',
     data: vm.newInvoice
    }).then(function successCallback(response) {
     console.log("create successful!");
     console.log(response.data);
     vm.invoices.push(response.data);
    }, function errorCallback(response) {
     console.log('There was an error posting the data', response);
    });
    }

    vm.editInvoice = function (invoice) {
    $http({
      method: 'PUT',
      url: '/api/invoices/'+invoice._id,
      data: invoice
    }).then(function successCallback(json){
    }, function errorCallback(response) {
      console.log('There was an error editing the data', response);
    });
    }

    vm.deleteInvoice = function (invoice) {
    $http({
      method: 'DELETE',
      url: '/api/invoices/'+ invoice._id
    }).then(function successCallback(json) {
      var index = vm.invoices.indexOf(invoice);
      console.log("index is: " + index);
      vm.invoices.splice(index,1)
    }, function errorCallback(response) {
      console.log('There was an error deleting the invoice', response);
    });
    }

}
