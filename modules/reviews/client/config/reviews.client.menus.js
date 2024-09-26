(function () {
  'use strict';

  angular
    .module('reviews')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Recenzijas',
      state: 'reviews',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'reviews', {
      title: 'Recenzijas',
      state: 'reviews.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'reviews', {
      title: 'Pievienot Recenziju',
      state: 'reviews.create',
      roles: ['user']
    });
  }
}());
