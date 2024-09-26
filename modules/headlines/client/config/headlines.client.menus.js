(function () {
  'use strict';

  angular
    .module('headlines')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Headlines',
      state: 'headlines',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'headlines', {
      title: 'Jaunumi',
      state: 'headlines.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'headlines', {
      title: 'Pievienot Jaunumu',
      state: 'headlines.create',
      roles: ['user']
    });
  }
}());
