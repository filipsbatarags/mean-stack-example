(function () {
  'use strict';

  angular
    .module('headlines.services')
    /*.factory('ItemsService', ['$http','$rootScope', function($http, $rootScope) 
{
    var service={};

    service.saveItem = function(item, image)
    {

        var fd = new FormData();
        fd.append('file', image);
        fd.append('item', JSON.stringify(item));
        $http.post('items/', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
            console.log('success add new item');
        })
        .error(function(e){
            console.log('error add new item', e);
        });


    };

    return service;

}

])*/
    .factory('HeadlinesService', HeadlinesService);

  HeadlinesService.$inject = ['$resource'];

  function HeadlinesService($resource) {
    return $resource('api/headlines/:headlineId', {
      headlineId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());



