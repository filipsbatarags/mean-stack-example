(function () {
  'use strict';

  angular
    .module('harticles')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Harticles',
      state: 'harticles',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'harticles', {
      title: 'Latvijas Rokmūzikas Vēsture',
      state: 'harticles.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'harticles', {
      title: 'Pievienot Rokmūzikas Vēstures Rakstu',
      state: 'harticles.create',
      roles: ['user']
    });
  }
}());
