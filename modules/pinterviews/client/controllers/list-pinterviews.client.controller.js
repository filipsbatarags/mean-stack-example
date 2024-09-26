(function () {
  'use strict';

  angular
    .module('pinterviews')
    .controller('PinterviewsListController', PinterviewsListController);

  PinterviewsListController.$inject = ['PinterviewsService', '$sce', '$filter', '$scope', '$state', '$meta', 'Socialshare','EventsService', '$http'];

  function PinterviewsListController(PinterviewsService, $sce, $filter, $scope, $state, $meta, Socialshare, EventsService, $http) {
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

    PinterviewsService.query().$promise.then(function (results) {
        angular.forEach(results, function (result) {
            //result.content= $filter('limitTo')(dataWithHtml, 140, 0);
            result.content = $sce.trustAsHtml(result.content);
        });
        vm.pinterviews = results;
    });
      
     /* $scope.jsonp_callback = function(data) {
    //do something with the data from the server
    console.log(data)
};
      */
      
      $http.get("https://www.radioswh.lv/prieksnama_top.json")
      //$http.get("https://jsonplaceholder.typicode.com/posts/1")
          .success(function (data) {
          vm.topsongs = data;
          //console.log(vm.topsongs);
      })
        .error(function (data) {
          console.log(data);
          console.log("Savienojuma kļūda");
      });
      
      //vm.pinterviews = $sce.trustAsHtml(vm.pinterviews);
  }
}());
