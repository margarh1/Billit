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

    vm.casey = function () {
    $http({
     method: 'POST',
     url: '/api/invoices',
     data: vm.newInvoice
    }).then(function successCallback(response) {
     console.log(response.data);
     vm.invoices.push(response.data);
    }, function errorCallback(response) {
     console.log('There was an error posting the data', response);
    });
    }
  }
