(function () {
  'use strict';

  angular
    .module('harticles.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('harticles', {
        abstract: true,
        url: '/latvijasrokmuzikasvesture',
        template: '<ui-view/>'
      })
      .state('harticles.list', {
        url: '',
        templateUrl: 'modules/harticles/client/views/list-harticles.client.view.html',
        controller: 'HarticlesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Latvijas Rokmūzikas Vēsture'
        }
      })
      .state('harticles.create', {
        url: '/create',
        templateUrl: 'modules/harticles/client/views/form-harticle.client.view.html',
        controller: 'HarticlesController',
        controllerAs: 'vm',
        resolve: {
          harticleResolve: newHarticle
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Harticles Create'
        }
      })
      .state('harticles.edit', {
        url: '/:harticleId/edit',
        templateUrl: 'modules/harticles/client/views/form-harticle.client.view.html',
        controller: 'HarticlesController',
        controllerAs: 'vm',
        resolve: {
          harticleResolve: getHarticle
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Harticle {{ harticleResolve.title }}'
        }
      })
      .state('harticles.view', {
        url: '/:harticleId',
        templateUrl: 'modules/harticles/client/views/view-harticle.client.view.html',
        controller: 'HarticlesController',
        controllerAs: 'vm',
        resolve: {
          harticleResolve: getHarticle
        },
        data: {
          pageTitle: 'Latvijas Rokmūzikas Vēsture - {{ harticleResolve.title }}'
        }
      });
  }

  getHarticle.$inject = ['$stateParams', 'HarticlesService'];

  function getHarticle($stateParams, HarticlesService) {
    return HarticlesService.get({
      harticleId: $stateParams.harticleId
    }).$promise;
  }

  newHarticle.$inject = ['HarticlesService'];

  function newHarticle(HarticlesService) {
    return new HarticlesService();
  }
}());
