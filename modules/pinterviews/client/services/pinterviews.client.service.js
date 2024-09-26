(function () {
  'use strict';

  angular
    .module('pinterviews.services')
    .factory('PinterviewsService', PinterviewsService);

  PinterviewsService.$inject = ['$resource'];

  function PinterviewsService($resource) {
    return $resource('api/pinterviews/:pinterviewId', {
      pinterviewId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
        getBySlug: {
            method: 'GET',
            params: {
              controller: 'read-slug'
            }
      }
    });
  }
}());