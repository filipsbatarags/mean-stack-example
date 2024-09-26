(function () {
  'use strict';

  angular
    .module('harticles')
    .controller('HarticlesListController', HarticlesListController);

  HarticlesListController.$inject = ['HarticlesService', '$sce', '$filter', '$scope', '$state', '$meta', 'Socialshare', 'EventsService'];

  function HarticlesListController(HarticlesService, $sce, $filter, $scope, $state, $meta, Socialshare, EventsService) {
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
      
      $scope.fullurl = "https://www.youtube.com/embed/videoseries?list=PLn0-fb0_zkvS1dwU9m_lz2szNQ40KehJT&index=" + $scope.randindex;
      $scope.mprfullurl = "https://www.youtube.com/embed/videoseries?list=PL9YK_usEkZO5TKB31dwuej60RsxSG3twf&index=" +$scope.mprrandindex;
      

    HarticlesService.query().$promise.then(function (results) {
        angular.forEach(results, function (result) {
            result.content = $sce.trustAsHtml(result.content);
        });
        vm.harticles = results;
    });
      //vm.harticles = $sce.trustAsHtml(vm.harticles);
  }
}());
