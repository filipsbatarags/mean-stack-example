(function () {
  'use strict';

  angular
    .module('harticles.services')
    .factory('HarticlesService', HarticlesService);

  HarticlesService.$inject = ['$resource'];

  function HarticlesService($resource) {
    return $resource('api/harticles/:harticleId', {
      harticleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());