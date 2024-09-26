(function () {
  'use strict';

  angular
    .module('interviews.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('intervijas', {
        abstract: true,
        url: '/intervijas',
        template: '<ui-view/>'
      })
      .state('intervijas.list', {
        url: '',
        templateUrl: 'modules/interviews/client/views/list-interviews.client.view.html',
        controller: 'InterviewsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Intervijas'
        }
      })
      .state('intervijas.create', {
        url: '/create',
        templateUrl: 'modules/interviews/client/views/form-interview.client.view.html',
        controller: 'InterviewsController',
        controllerAs: 'vm',
        resolve: {
          interviewResolve: newInterview
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Pievienot Interviju'
        }
      })
      .state('intervijas.edit', {
        url: '/:interviewId/edit',
        //url: '/:interviewSlug/edit',
        templateUrl: 'modules/interviews/client/views/form-interview.client.view.html',
        controller: 'InterviewsController',
        controllerAs: 'vm',
        resolve: {
          interviewResolve: getInterview
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Rediģēt Interviju {{ interviewResolve.title }}'
        }
      })
      .state('intervijas.view', {
        url: '/:interviewId',
        //url: '/:interviewSlug',
        templateUrl: 'modules/interviews/client/views/view-interview.client.view.html',
        controller: 'InterviewsController',
        controllerAs: 'vm',
        resolve: {
          interviewResolve: getInterview
        },
        data: {
          pageTitle: 'Intervija - {{ interviewResolve.title }}'
        }
      });
  }

  getInterview.$inject = ['$stateParams', 'InterviewsService'];

  function getInterview($stateParams, InterviewsService) {
    return InterviewsService.get({
      interviewId: $stateParams.interviewId
    }).$promise;
  }

  newInterview.$inject = ['InterviewsService'];

  function newInterview(InterviewsService) {
    return new InterviewsService();
  }
}());
