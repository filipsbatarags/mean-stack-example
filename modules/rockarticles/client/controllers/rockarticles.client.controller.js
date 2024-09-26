(function () {
  'use strict';

  angular
    .module('rockarticles')
    .controller('RockarticlesController', RockarticlesController);

  RockarticlesController.$inject = ['$scope', '$state', 'rockarticleResolve', '$window', 'Authentication', '$sce', 'EventsService', '$location'];

  function RockarticlesController($scope, $state, rockarticle, $window, Authentication, $sce, EventsService, $location) {
    var vm = this;
      
      EventsService.query().$promise.then(function (results) {
        angular.forEach(results, function (result) {
            //result.content= $filter('limitTo')(dataWithHtml, 140, 0);
            result.content = $sce.trustAsHtml(result.content);
        });
        vm.events = results;
    });

       $scope.randindex = Math.floor((Math.random() * 51));
      $scope.mprrandindex = Math.floor((Math.random() * 11));
      
      $scope.myurlis = $location.absUrl();
      
      $scope.fullurl = "https://www.youtube.com/embed/videoseries?list=PLn0-fb0_zkvS1dwU9m_lz2szNQ40KehJT&index=" + $scope.randindex;
      $scope.mprfullurl = "https://www.youtube.com/embed/videoseries?list=PL9YK_usEkZO5TKB31dwuej60RsxSG3twf&index=" +$scope.mprrandindex;
      
      
    vm.rockarticle = rockarticle;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.rockarticle.content = $sce.trustAsHtml(vm.rockarticle.content);

    // Remove existing Rockarticle
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.rockarticle.$remove($state.go('rockarticles.list'));
      }
    }

    // Save Rockarticle
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.rockarticleForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.rockarticle._id) {
        vm.rockarticle.$update(successCallback, errorCallback);
      } else {
        vm.rockarticle.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('rockarticles.view', {
          rockarticleId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
