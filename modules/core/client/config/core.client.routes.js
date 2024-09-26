(function () {
  'use strict';

  angular
    .module('core.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routeConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.rule(function ($injector, $location) {        
      var path = $location.path();
      var hasTrailingSlash = path.length > 1 && path[path.length - 1] === '/';

      if (hasTrailingSlash) {
        // if last character is a slash, return the same url without the slash
        var newPath = path.substr(0, path.length - 1);
        $location.replace().path(newPath);
      }
        
        //var host = $location.host();
       // if (host === "roks.lv" || host === "rokmuzika.lv" || host === "www.roks.lv" || host === "www.rokmuzika.lv") {
       //         if ($location.path() === "/") {
       //             var lrmarockpath = path + "lrmarock";
      //              $location.replace().path(lrmarockpath);
      //          }    
      //  }
    });
      

      //$urlRouterProvider.when('/', '/jaunumi');
      
      


    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    $stateProvider
      //.state('home', {
      //  url: '/',
      //  templateUrl: 'modules/core/client/views/home.client.view.html',
      //  controller: 'HomeController',
      //  controllerAs: 'vm'
        //redirectTo: '/jaunumi'
      //})
      .state('lrmarock', {
        url: '/',
        templateUrl: 'modules/core/client/views/lrmarock.client.view.html',
        controller: 'LrmarockController',
        controllerAs: 'vm'
      })
      //.state('intervijas', {
      //  url: '/intervijas',
      //  templateUrl: 'modules/core/client/views/intervijas.client.view.html',
      //  controller: 'IntervijasController',
      //  controllerAs: 'vm'
      //})
      //.state('atrastsprieksnama', {
      //  url: '/intervijas/atrastsprieksnama',
      //  templateUrl: 'modules/core/client/views/atrastsprieksnama.client.view.html',
      //  controller: 'AtrastsprieksnamaController',
      //  controllerAs: 'vm'
      //})
      //.state('recenzijas', {
       // url: '/recenzijas',
       // templateUrl: 'modules/core/client/views/recenzijas.client.view.html',
      //  controller: 'RecenzijasController',
      //  controllerAs: 'vm'
      //})
      .state('albumi', {
        url: '/recenzijas/albumi',
        templateUrl: 'modules/core/client/views/albumi.client.view.html',
        controller: 'AlbumiController',
        controllerAs: 'vm'
      })
      .state('gramatas', {
        url: '/recenzijas/gramatas',
        templateUrl: 'modules/core/client/views/gramatas.client.view.html',
        controller: 'GramatasController',
        controllerAs: 'vm'
      })
      .state('filmas', {
        url: '/recenzijas/filmas',
        templateUrl: 'modules/core/client/views/filmas.client.view.html',
        controller: 'FilmasController',
        controllerAs: 'vm'
      })
      .state('koncerti', {
        url: '/recenzijas/koncerti',
        templateUrl: 'modules/core/client/views/koncerti.client.view.html',
        controller: 'KoncertiController',
        controllerAs: 'vm'
      })
      .state('lietas', {
        url: '/recenzijas/lietas',
        templateUrl: 'modules/core/client/views/lietas.client.view.html',
        controller: 'LietasController',
        controllerAs: 'vm'
      })
      .state('strimi', {
        url: '/lrmarock/strimi',
        templateUrl: 'modules/core/client/views/strimi.client.view.html',
        controller: 'StrimiController',
        controllerAs: 'vm'
      })
      .state('raksti', {
        url: '/raksti',
        templateUrl: 'modules/core/client/views/raksti.client.view.html',
        controller: 'RakstiController',
        controllerAs: 'vm'
      })
      //.state('jaunumi', {
      //  url: '/raksti/jaunumi',
      //  templateUrl: 'modules/core/client/views/jaunumi.client.view.html',
      //  controller: 'JaunumiController',
      //  controllerAs: 'vm'
      //})
      //.state('latvijasrokmuzikasvesture', {
      //  url: '/raksti/latvijasrokmuzikasvesture',
      //  templateUrl: 'modules/core/client/views/latvijasrokmuzikasvesture.client.view.html',
      //  controller: 'LatvijasRokmuzikasVestureController',
      //  controllerAs: 'vm'
      //})
      .state('galerija', {
        url: '/galerija',
        templateUrl: 'modules/core/client/views/galerija.client.view.html',
        controller: 'GalerijaController',
        controllerAs: 'vm'
      })
      .state('foto', {
        url: '/galerija/foto',
        templateUrl: 'modules/core/client/views/foto.client.view.html',
        controller: 'FotoController',
        controllerAs: 'vm'
      })
      .state('video', {
        url: '/galerija/video',
        templateUrl: 'modules/core/client/views/video.client.view.html',
        controller: 'VideoController',
        controllerAs: 'vm'
      })
      .state('jaunakieieraksti', {
        url: '/jaunakieieraksti',
        templateUrl: 'modules/core/client/views/jaunakieieraksti.client.view.html',
        controller: 'JaunakieIerakstiController',
        controllerAs: 'vm'
      })
      .state('pierakstitiesjaunumiem', {
        url: '/pierakstitiesjaunumiem',
        templateUrl: 'modules/core/client/views/pierakstitiesjaunumiem.client.view.html',
        controller: 'PierakstitiesJaunumiemController',
        controllerAs: 'vm'
      })
      .state('veikals', {
        url: '/veikals',
        templateUrl: 'modules/core/client/views/veikals.client.view.html',
        controller: 'VeikalsController',
        controllerAs: 'vm'
      })
      .state('lrmajaunumi', {
        url: '/lrma/jaunumi',
        templateUrl: 'modules/core/client/views/lrmajaunumi.client.view.html',
        controller: 'LrmaJaunumiController',
        controllerAs: 'vm'
      })
      .state('lrmaparmums', {
        url: '/lrma/parmums',
        templateUrl: 'modules/core/client/views/lrmaparmums.client.view.html',
        controller: 'LrmaParmumsController',
        controllerAs: 'vm'
      })
      .state('lrmastatuti', {
        url: '/lrma/statuti',
        templateUrl: 'modules/core/client/views/lrmastatuti.client.view.html',
        controller: 'LrmaStatutiController',
        controllerAs: 'vm'
      })
       .state('paldies', {
        url: '/lrma/donate/paldies',
        templateUrl: 'modules/core/client/views/paldies.client.view.html',
        controller: 'PaldiesController',
        controllerAs: 'vm'
      })
      .state('welcome', {
        url: '/lrma/welcome',
        templateUrl: 'modules/core/client/views/welcome.client.view.html',
        controller: 'WelcomeController',
        controllerAs: 'vm'
      })
      .state('lrmakontakti', {
        url: '/lrma/kontakti',
        templateUrl: 'modules/core/client/views/lrmakontakti.client.view.html',
        controller: 'LrmaKontaktiController',
        controllerAs: 'vm'
      })
      .state('donate', {
        url: '/lrma/donate',
        templateUrl: 'modules/core/client/views/donate.client.view.html',
        controller: 'DonateController',
        controllerAs: 'vm'
      })
      .state('oldstat', {
        url: '/statuti',
        templateUrl: 'modules/core/client/views/lrmastatuti.client.view.html',
        controller: 'LrmaStatutiController',
        controllerAs: 'vm'
      })
       .state('oldparmums', {
        url: '/parmums',
        templateUrl: 'modules/core/client/views/lrmaparmums.client.view.html',
        controller: 'LrmaParmumsController',
        controllerAs: 'vm'
      })
      // .state('oldjaun', {
      //  url: '/jaunumi',
      //  templateUrl: 'modules/core/client/views/lrmajaunumi.client.view.html',
      //  controller: 'LrmaJaunumiController',
      //  controllerAs: 'vm'
     // })
      .state('bad-request', {
        url: '/bad-request',
        templateUrl: 'modules/core/client/views/400.client.view.html',
        data: {
          ignoreState: true,
          pageTitle: 'Bad-Request'
        }
      })
      .state('forbidden', {
        url: '/forbidden',
        templateUrl: 'modules/core/client/views/403.client.view.html',
        data: {
          ignoreState: true,
          pageTitle: 'Forbidden'
        }
      });
  }
}());
