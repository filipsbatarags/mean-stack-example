(function () {
  'use strict';

  angular
    .module('rockarticles.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('rockarticles', {
        abstract: true,
        url: '/rokastasti',
        template: '<ui-view/>'
      })
      .state('rockarticles.list', {
        url: '',
        templateUrl: 'modules/rockarticles/client/views/list-rockarticles.client.view.html',
        controller: 'RockarticlesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Roka Stāsti'
        }
      })
      .state('rockarticles.create', {
        url: '/create',
        templateUrl: 'modules/rockarticles/client/views/form-rockarticle.client.view.html',
        controller: 'RockarticlesController',
        controllerAs: 'vm',
        resolve: {
          rockarticleResolve: newRockarticle
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Rockarticles Create'
        }
      })
      .state('rockarticles.edit', {
        url: '/:rockarticleId/edit',
        templateUrl: 'modules/rockarticles/client/views/form-rockarticle.client.view.html',
        controller: 'RockarticlesController',
        controllerAs: 'vm',
        resolve: {
          rockarticleResolve: getRockarticle
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Rockarticle {{ rockarticleResolve.title }}'
        }
      })
      .state('rockarticles.view', {
        url: '/:rockarticleId',
        templateUrl: 'modules/rockarticles/client/views/view-rockarticle.client.view.html',
        controller: 'RockarticlesController',
        controllerAs: 'vm',
        resolve: {
          rockarticleResolve: getRockarticle
        },
        data: {
          pageTitle: 'Roka Stāsti - {{ rockarticleResolve.title }}'
        }
      });
  }

  getRockarticle.$inject = ['$stateParams', 'RockarticlesService'];

  function getRockarticle($stateParams, RockarticlesService) {
    return RockarticlesService.get({
      rockarticleId: $stateParams.rockarticleId
    }).$promise;
  }

  newRockarticle.$inject = ['RockarticlesService'];

  function newRockarticle(RockarticlesService) {
    return new RockarticlesService();
  }
}());
