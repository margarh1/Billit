angular
  .module('billit', [])
  .controller('InvoicesIndexController', InvoicesIndexController);

  InvoicesIndexController.$inject = ['$http'];
  function InvoicesIndexController($http){
    var vm = this;
    vm.newInvoice = {};

    vm.emailReminder =  function(invoice) {
      var email = invoice.customerEmail;
      //TODO: could include specific invoice info via passed data
      // var invoiceTitle = invoice.title;
      // console.log("got title: " + invoiceTitle);
      $http({
    	method: 'POST',
      // data: {invoiceTitle: invoiceTitle},
      url: '/emailreminder?email='+email
    }).then(function(response) {
      // data: {invoiceTitle: invoiceTitle}
    });
      alert("Email sent!");
    }

    vm.printpdf =  function() {
      $http({
      method: 'POST',
      url: '/printpdf'
    }).then(function(response) {

    });
      // alert("printing!");
    }

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

    $http({
      method: 'GET',
      url: '/api/currentuser'
    }).then(function successCallback(response) {
      console.log("rendering current user data success");
      vm.user = response.data;
    }, function errorCallback(response) {
      console.log('There was an error getting the current user data', response);
    });

    vm.editInvoice = function (invoice) {
      $http({
        method: 'PUT',
        url: '/api/invoices/' + invoice._id,
        data: invoice
      }).then(function successCallback(json){
      }, function errorCallback(response) {
        console.log('There was an error editing the data', response);
      });
    }

    vm.showOneInvoice = function (invoice) {
      $http({
        method: 'GET',
        url: '/api/invoices/' + invoice._id,
        data: invoice
      }).then(function successCallback(json){
      }, function errorCallback(response) {
        console.log('There was an error rendering one invoice', response);
      });
    }

    vm.deleteInvoice = function (invoice) {
      $http({
        method: 'DELETE',
        url: '/api/invoices/' + invoice._id
      }).then(function successCallback(json) {
        var index = vm.invoices.indexOf(invoice);
        console.log("index is: " + index);
        vm.invoices.splice(index,1)
      }, function errorCallback(response) {
        console.log('There was an error deleting the invoice', response);
      });
    }
}
