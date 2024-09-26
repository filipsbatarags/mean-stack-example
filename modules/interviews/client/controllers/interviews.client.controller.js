(function () {
  'use strict';

  angular
    .module('interviews')
    .controller('InterviewsController', InterviewsController);

  InterviewsController.$inject = ['$scope', '$state', 'interviewResolve', '$window', 'Authentication', '$sce', 'EventsService', '$location'];

  function InterviewsController($scope, $state, interview, $window, Authentication, $sce, EventsService, $location) {
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
      
      
    vm.interview = interview;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.interview.content = $sce.trustAsHtml(vm.interview.content);

    // Remove existing Interview
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.interview.$remove($state.go('intervijas.list'));
      }
    }

    // Save Interview
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.interviewForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.interview._id) {
        vm.interview.$update(successCallback, errorCallback);
      } else {
        vm.interview.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('intervijas.view', {
          interviewId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
