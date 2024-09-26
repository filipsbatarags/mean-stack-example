(function () {
  'use strict';

  angular
    .module('core')
    .filter('trustAsResourceUrl', ['$sce', function($sce) {
        return function(val) {
        return $sce.trustAsResourceUrl(val);
        };
    }])
    .controller('LrmarockController', LrmarockController);

      LrmarockController.$inject = ['$filter', '$scope', '$state', '$sce', 'InterviewsService', 'HarticlesService', 'PinterviewsService', 'EventsService', 'HeadlinesService', 'ReviewsService', 'RockarticlesService', 'Authentication'];

    
  function LrmarockController($filter, $scope, $state, $sce, InterviewsService, HarticlesService, PinterviewsService, EventsService, HeadlinesService, ReviewsService, RockarticlesService, Authentication) {
    var vm = this;
      vm.authentication = Authentication;
      
      InterviewsService.query().$promise.then(function (results) {
        angular.forEach(results, function (result) {
            //result.content= $filter('limitTo')(dataWithHtml, 140, 0);
            result.content = $sce.trustAsHtml(result.content);
        });
        vm.interviews = results;
    });
      
       RockarticlesService.query().$promise.then(function (results) {
        angular.forEach(results, function (result) {
            //result.content= $filter('limitTo')(dataWithHtml, 140, 0);
            result.content = $sce.trustAsHtml(result.content);
        });
        vm.rockarticles = results;
    });
      
       ReviewsService.query().$promise.then(function (results) {
        angular.forEach(results, function (result) {
            //result.content= $filter('limitTo')(dataWithHtml, 140, 0);
            result.content = $sce.trustAsHtml(result.content);
        });
        vm.reviews = results;
    });
      
      HeadlinesService.query().$promise.then(function (results) {
        angular.forEach(results, function (result) {
            //result.content= $filter('limitTo')(dataWithHtml, 140, 0);
            result.content = $sce.trustAsHtml(result.content);
        });
        vm.headlines = results;
    });
      
       EventsService.query().$promise.then(function (results) {
        angular.forEach(results, function (result) {
            //result.content= $filter('limitTo')(dataWithHtml, 140, 0);
            result.content = $sce.trustAsHtml(result.content);
        });
        vm.events = results;
    });
      
          HarticlesService.query().$promise.then(function (results) {
        angular.forEach(results, function (result) {
            result.content = $sce.trustAsHtml(result.content);
        });
        vm.harticles = results;
    });
      
       PinterviewsService.query().$promise.then(function (results) {
        angular.forEach(results, function (result) {
            //result.content= $filter('limitTo')(dataWithHtml, 140, 0);
            result.content = $sce.trustAsHtml(result.content);
            //result.content.description = $filter('limitTo')(result.content.description, 7);
        });
        vm.pinterviews = results;
    });
      
      
      //interviews, headlines, harticles, pinterviews
      
          $scope.quantity = 2;
          $scope.chronoquantity = 6;

        //$analytics.pageTrack('/');

      
      $scope.randindex = Math.floor((Math.random() * 51));
      $scope.mprrandindex = Math.floor((Math.random() * 15));
      
      $scope.fullurl = "https://www.youtube.com/embed/videoseries?list=PLn0-fb0_zkvS1dwU9m_lz2szNQ40KehJT&index=" + $scope.randindex;
      $scope.mprfullurl = "https://www.youtube.com/embed/videoseries?list=PL9YK_usEkZO5TKB31dwuej60RsxSG3twf&index=" +$scope.mprrandindex;
      
      
  }
}());
