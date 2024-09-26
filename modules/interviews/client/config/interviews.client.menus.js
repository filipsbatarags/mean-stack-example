(function () {
  'use strict';

  angular
    .module('interviews')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Intervijas',
      state: 'intervijas',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'interviews', {
      title: 'Intervijas',
      state: 'intervijas.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'interviews', {
      title: 'Pievienot Interviju',
      state: 'intervijas.create',
      roles: ['user']
    });
  }
}());
