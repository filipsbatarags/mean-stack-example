(function () {
  'use strict';

  angular
    .module('articles')
    .controller('ArticlesListController', ArticlesListController);

  ArticlesListController.$inject = ['ArticlesService', '$sce', 'Authentication'];

  function ArticlesListController(ArticlesService, $sce, Authentication) {
    var vm = this;
          vm.authentication = Authentication;

    ArticlesService.query().$promise.then(function (results) {
        angular.forEach(results, function (result) {
            result.content = $sce.trustAsHtml(result.content);
        });
        vm.articles = results;
    });
      //vm.articles = $sce.trustAsHtml(vm.articles);
  }
}());
