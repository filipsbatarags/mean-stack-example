(function () {
  'use strict';

  angular
    .module('events')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Pasākumi',
      state: 'events',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'events', {
      title: 'Pasākumu Saraksts',
      state: 'events.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'events', {
      title: 'Pievienot Pasākumu',
      state: 'events.create',
      roles: ['user']
    });
  }
}());
