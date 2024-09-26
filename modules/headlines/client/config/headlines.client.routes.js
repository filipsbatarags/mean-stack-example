(function () {
  'use strict';

  angular
    .module('headlines.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('headlines', {
        abstract: true,
        url: '/jaunumi',
        template: '<ui-view/>'
      })
      .state('headlines.list', {
        url: '',
        templateUrl: 'modules/headlines/client/views/list-headlines.client.view.html',
        controller: 'HeadlinesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Jaunumi'
        }
      })
      .state('headlines.create', {
        url: '/create',
        templateUrl: 'modules/headlines/client/views/form-headline.client.view.html',
        controller: 'HeadlinesController',
        controllerAs: 'vm',
        resolve: {
          headlineResolve: newHeadline
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Headlines Create'
        }
      })
      .state('headlines.edit', {
        url: '/:headlineId/edit',
        templateUrl: 'modules/headlines/client/views/form-headline.client.view.html',
        controller: 'HeadlinesController',
        controllerAs: 'vm',
        resolve: {
          headlineResolve: getHeadline
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Headline {{ headlineResolve.title }}'
        }
      })
      .state('headlines.view', {
        url: '/:headlineId',
        templateUrl: 'modules/headlines/client/views/view-headline.client.view.html',
        controller: 'HeadlinesController',
        controllerAs: 'vm',
        resolve: {
          headlineResolve: getHeadline
        },
        data: {
          pageTitle: 'Jaunumi - {{ headlineResolve.title }}'
        }
      });
  }

  getHeadline.$inject = ['$stateParams', 'HeadlinesService'];

  function getHeadline($stateParams, HeadlinesService) {
    return HeadlinesService.get({
      headlineId: $stateParams.headlineId
    }).$promise;
  }

  newHeadline.$inject = ['HeadlinesService'];

  function newHeadline(HeadlinesService) {
    return new HeadlinesService();
  }
}());
