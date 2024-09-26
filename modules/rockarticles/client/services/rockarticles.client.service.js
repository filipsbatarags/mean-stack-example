(function () {
  'use strict';

  angular
    .module('rockarticles.services')
    .factory('RockarticlesService', RockarticlesService);

  RockarticlesService.$inject = ['$resource'];

  function RockarticlesService($resource) {
    return $resource('api/rockarticles/:rockarticleId', {
      rockarticleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
