(function () {
  'use strict';

  angular
    .module('pinterviews')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Atrasts Priekšnamā',
      state: 'atrastsprieksnama',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'pinterviews', {
      title: 'Atrasts Priekšnamā',
      state: 'atrastsprieksnama.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'pinterviews', {
      title: 'Pievienot "Atrasts Priekšnamā" Interviju',
      state: 'atrastsprieksnama.create',
      roles: ['user']
    });
  }
}());
