(function () {
  'use strict';

  angular
    .module('articles')
    .controller('ArticlesController', ArticlesController);

  ArticlesController.$inject = ['$scope', '$state', 'articleResolve', '$window', 'Authentication', '$sce'];

  function ArticlesController($scope, $state, article, $window, Authentication, $sce) {
    var vm = this;

    vm.article = article;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.article.content = $sce.trustAsHtml(vm.article.content);
    vm.article.wysiwyg = $sce.trustAsHtml(vm.article.wysiwyg);

    // Remove existing Article
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.article.$remove($state.go('articles.list'));
      }
    }

    // Save Article
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.articleForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.article._id) {
        vm.article.$update(successCallback, errorCallback);
      } else {
        vm.article.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('articles.view', {
          articleId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
      
      
      
      function readFile() {
  
  if (this.files && this.files[0]) {
    
    var FR= new FileReader();
    
    FR.addEventListener("load", function(e) {
        vm.article.base64img = e.target.result;
     //document.getElementById("img").src       = e.target.result;
      //document.getElementById("b64").innerHTML = e.target.result;
        $scope.$digest();
    }); 
    
    FR.readAsDataURL( this.files[0] );
  }
  
}

      if (document.getElementById("inp")) {
document.getElementById("inp").addEventListener("change", readFile);
      };
      
      
  }
}());
