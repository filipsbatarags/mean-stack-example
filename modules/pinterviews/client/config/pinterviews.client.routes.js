(function () {
  'use strict';

  angular
    .module('pinterviews.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('atrastsprieksnama', {
        abstract: true,
        url: '/atrastsprieksnama',
        template: '<ui-view/>'
      })
      .state('atrastsprieksnama.list', {
        url: '',
        templateUrl: 'modules/pinterviews/client/views/list-pinterviews.client.view.html',
        controller: 'PinterviewsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Atrasts Priekšnamā'
        }
      })
      .state('atrastsprieksnama.create', {
        url: '/create',
        templateUrl: 'modules/pinterviews/client/views/form-pinterview.client.view.html',
        controller: 'PinterviewsController',
        controllerAs: 'vm',
        resolve: {
          pinterviewResolve: newPinterview
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Pievienot "Atrasts Priekšnamā" Interviju'
        }
      })
      .state('atrastsprieksnama.edit', {
        url: '/:interviewId/edit',
        //url: '/:pinterviewSlug/edit',
        templateUrl: 'modules/pinterviews/client/views/form-pinterview.client.view.html',
        controller: 'PinterviewsController',
        controllerAs: 'vm',
        resolve: {
          pinterviewResolve: getPinterview
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Rediģēt "Atrasts Priekšnamā" Interviju {{ pinterviewResolve.title }}'
        }
      })
      .state('atrastsprieksnama.view', {
        url: '/:pinterviewId',
        //url: '/:pinterviewSlug',
        templateUrl: 'modules/pinterviews/client/views/view-pinterview.client.view.html',
        controller: 'PinterviewsController',
        controllerAs: 'vm',
        resolve: {
          pinterviewResolve: getPinterview
        },
        data: {
          pageTitle: 'Atrasts Priekšnamā - {{ pinterviewResolve.title }}'
        }
      });
  }

  getPinterview.$inject = ['$stateParams', 'PinterviewsService'];

  function getPinterview($stateParams, PinterviewsService) {
    return PinterviewsService.get({
      pinterviewId: $stateParams.pinterviewId
    }).$promise;
  }

  newPinterview.$inject = ['PinterviewsService'];

  function newPinterview(PinterviewsService) {
    return new PinterviewsService();
  }
}());
