(function () {
  'use strict';

  angular
    .module('headlines')
    .controller('HeadlinesController', HeadlinesController);

  HeadlinesController.$inject = ['$scope', '$state', 'headlineResolve', '$window', 'Authentication', '$sce', 'EventsService', '$location'];

  function HeadlinesController($scope, $state, headline, $window, Authentication, $sce, EventsService, $location) {
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
      
      $scope.imagefunct = function(responseJSON) {
          console.log(responseJSON);
      }
      
      $scope.test = function(responseJSON) {
          console.log(responseJSON);
      }
      
      
    vm.headline = headline;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.responseJSON = {};
    vm.remove = remove;
    vm.save = save;
    vm.headline.content = $sce.trustAsHtml(vm.headline.content);
    vm.headline.wysiwyg = $sce.trustAsHtml(vm.headline.wysiwyg);
    //vm.headline.imgurl = "";
      
      
    
    // Remove existing Headline
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.headline.$remove($state.go('headlines.list'));
      }
    }

    // Save Headline
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.headlineForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.headline._id) {
        vm.headline.$update(successCallback, errorCallback);
      } else {
        vm.headline.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('headlines.view', {
          headlineId: res._id
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
        vm.headline.base64img = e.target.result;
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