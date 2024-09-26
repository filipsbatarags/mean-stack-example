(function () {
  'use strict';

  angular
    .module('core')
    //.filter('trustAsResourceUrl', ['$sce', function($sce) {
    //    return function(val) {
    //    return $sce.trustAsResourceUrl(val);
   //     };
   // }])
    .controller('LatvijasRokmuzikasVestureController', LatvijasRokmuzikasVestureController);

      LatvijasRokmuzikasVestureController.$inject = ['$scope', '$state', '$sce', 'ArticlesService', '$meta', 'Socialshare'];

    
  function LatvijasRokmuzikasVestureController($scope, $state, $sce, ArticlesService, $meta, Socialshare) {
    var vm = this;
            
      $scope.randindex = Math.floor((Math.random() * 51));
      $scope.mprrandindex = Math.floor((Math.random() * 10));
      
      $scope.fullurl = "https://www.youtube.com/embed/videoseries?list=PLn0-fb0_zkvS1dwU9m_lz2szNQ40KehJT&index=" + $scope.randindex;
      $scope.mprfullurl = "https://www.youtube.com/embed/videoseries?list=PL9YK_usEkZO5TKB31dwuej60RsxSG3twf&index=" +$scope.mprrandindex;
      
      //$meta.setTitle('LRMA - Atrasts Priekšnamā');
      //$meta.setImage('https://lrma.lv/modules/core/client/img/brand/lrma.png');
      //$meta.setDescription('"Atrasts Priekšnamā" ir interviju cikls sadarbībā ar Radio SWH mūzikas topu "Priekšnams"');
      //$meta.setKeywords('Radio SWH, Priekšnams, LRMA');
      
      
     // Socialshare.share({
    //  'provider': 'facebook',
    //  'attrs': {
    //    'socialshareUrl': 'https://www.lrma.lv/intervijas/atrastsprieksnama',
    //    'socialshareVia': '112034179491052',
    //    'socialshareQuote': '"Atrasts Priekšnamā" ir interviju cikls sadarbībā ar Radio SWH mūzikas topu "Priekšnams"''
    //  }
    //});
      
    //$meta.addKeywords('additional, keywords, to, the, default');

    //$meta.get('anyOtherMetaTagName').content = 'custom content';
      
    //  ArticlesService.query().$promise.then(function (results) {
   //     angular.forEach(results, function (result) {
   //         result.content = $sce.trustAsHtml(result.content);
   //     });
   //     vm.articles = results;
  //  });
      
  }
}());
