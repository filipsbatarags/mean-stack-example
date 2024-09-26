(function () {
  'use strict';

  angular
    .module('interviews.services')
    .factory('InterviewsService', InterviewsService);

  InterviewsService.$inject = ['$resource'];

  function InterviewsService($resource) {
    return $resource('api/interviews/:interviewId', {
      interviewId: '@_id'
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