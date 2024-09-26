(function () {
  'use strict';

  angular
    .module('core')
    .controller('WelcomeController', WelcomeController);

      WelcomeController.$inject = ['$scope', '$state'];

    
  function WelcomeController($scope, $state) {
    var vm = this;
    
  }
}());
