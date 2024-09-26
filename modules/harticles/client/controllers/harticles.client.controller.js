(function () {
  'use strict';

  angular
    .module('harticles')
    .controller('HarticlesController', HarticlesController);

  HarticlesController.$inject = ['$scope', '$state', 'harticleResolve', '$window', 'Authentication', '$sce', 'EventsService', '$location'];

  function HarticlesController($scope, $state, harticle, $window, Authentication, $sce, EventsService, $location) {
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
      
      
    vm.harticle = harticle;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.harticle.content = $sce.trustAsHtml(vm.harticle.content);

    // Remove existing Harticle
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.harticle.$remove($state.go('harticles.list'));
      }
    }

    // Save Harticle
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.harticleForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.harticle._id) {
        vm.harticle.$update(successCallback, errorCallback);
      } else {
        vm.harticle.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('harticles.view', {
          harticleId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
