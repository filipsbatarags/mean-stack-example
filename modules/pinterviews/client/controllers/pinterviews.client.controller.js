(function () {
  'use strict';

  angular
    .module('pinterviews')
    .controller('PinterviewsController', PinterviewsController);

  PinterviewsController.$inject = ['$scope', '$state', 'pinterviewResolve', '$window', 'Authentication', '$sce', 'EventsService', '$location'];

  function PinterviewsController($scope, $state, pinterview, $window, Authentication, $sce, EventsService, $location) {
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
      
    vm.pinterview = pinterview;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.pinterview.content = $sce.trustAsHtml(vm.pinterview.content);

      $scope.shareDR = function() {
          window.open(
  'http://www.draugiem.lv/say/ext/add.php?title=' + encodeURIComponent( vm.pinterview.title ) +
  '&link=' + encodeURIComponent( $scope.myurlis ) +
  '&titlePrefix=' + encodeURIComponent( 'LRMA.lv' ),
  '',
  'location=1,status=1,scrollbars=0,resizable=0,width=530,height=400'
 );
 return false;
      };
      
    // Remove existing Pinterview
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.pinterview.$remove($state.go('atrastsprieksnama.list'));
      }
    }

    // Save Pinterview
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.pinterviewForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.pinterview._id) {
        vm.pinterview.$update(successCallback, errorCallback);
      } else {
        vm.pinterview.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('atrastsprieksnama.view', {
          pinterviewId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
