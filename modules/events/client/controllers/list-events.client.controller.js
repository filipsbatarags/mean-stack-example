(function () {
  'use strict';

  angular
    .module('events')
    .controller('EventsListController', EventsListController);

  EventsListController.$inject = ['EventsService', '$sce'];

  function EventsListController(EventsService, $sce) {
    var vm = this;

    EventsService.query().$promise.then(function (results) {
        angular.forEach(results, function (result) {
            result.content = $sce.trustAsHtml(result.content);
        });
        vm.events = results;
    });
      //vm.events = $sce.trustAsHtml(vm.events);
  }
}());
