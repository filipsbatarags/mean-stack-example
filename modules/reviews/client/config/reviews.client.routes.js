(function () {
  'use strict';

  angular
    .module('reviews.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('reviews', {
        abstract: true,
        url: '/recenzijas',
        template: '<ui-view/>'
      })
      .state('reviews.list', {
        url: '',
        templateUrl: 'modules/reviews/client/views/list-reviews.client.view.html',
        controller: 'ReviewsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Recenzijas'
        }
      })
      .state('reviews.create', {
        url: '/create',
        templateUrl: 'modules/reviews/client/views/form-review.client.view.html',
        controller: 'ReviewsController',
        controllerAs: 'vm',
        resolve: {
          reviewResolve: newReview
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Reviews Create'
        }
      })
      .state('reviews.edit', {
        url: '/:reviewId/edit',
        templateUrl: 'modules/reviews/client/views/form-review.client.view.html',
        controller: 'ReviewsController',
        controllerAs: 'vm',
        resolve: {
          reviewResolve: getReview
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Review {{ reviewResolve.title }}'
        }
      })
      .state('reviews.view', {
        url: '/:reviewId',
        templateUrl: 'modules/reviews/client/views/view-review.client.view.html',
        controller: 'ReviewsController',
        controllerAs: 'vm',
        resolve: {
          reviewResolve: getReview
        },
        data: {
          pageTitle: 'Recenzija - {{ reviewResolve.title }}'
        }
      });
  }

  getReview.$inject = ['$stateParams', 'ReviewsService'];

  function getReview($stateParams, ReviewsService) {
    return ReviewsService.get({
      reviewId: $stateParams.reviewId
    }).$promise;
  }

  newReview.$inject = ['ReviewsService'];

  function newReview(ReviewsService) {
    return new ReviewsService();
  }
}());
