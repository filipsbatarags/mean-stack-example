(function () {
  'use strict';

  angular
    .module('reviews')
    .controller('ReviewsController', ReviewsController);

  ReviewsController.$inject = ['$scope', '$state', 'reviewResolve', '$window', 'Authentication', '$sce', 'EventsService', '$location'];

  function ReviewsController($scope, $state, review, $window, Authentication, $sce, EventsService, $location) {
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
      
      
    vm.review = review;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.review.content = $sce.trustAsHtml(vm.review.content);

    // Remove existing Review
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.review.$remove($state.go('reviews.list'));
      }
    }

    // Save Review
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.reviewForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.review._id) {
        vm.review.$update(successCallback, errorCallback);
      } else {
        vm.review.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('reviews.view', {
          reviewId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
