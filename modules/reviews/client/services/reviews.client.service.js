(function () {
  'use strict';

  angular
    .module('reviews.services')
    .factory('ReviewsService', ReviewsService);

  ReviewsService.$inject = ['$resource'];

  function ReviewsService($resource) {
    return $resource('api/reviews/:reviewId', {
      reviewId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());