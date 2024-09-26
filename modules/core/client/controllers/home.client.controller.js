(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

      HomeController.$inject = ['$scope', '$state'];

    
  function HomeController($scope, $state) {
    var vm = this;
    
      $scope.go('jaunumi');
  }
}());
