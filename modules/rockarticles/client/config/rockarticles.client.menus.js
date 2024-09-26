(function () {
  'use strict';

  angular
    .module('rockarticles')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Rockarticles',
      state: 'rockarticles',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'rockarticles', {
      title: 'Roka Raksti',
      state: 'rockarticles.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'rockarticles', {
      title: 'Pievienot Roka Rakstu',
      state: 'rockarticles.create',
      roles: ['user']
    });
  }
}());
