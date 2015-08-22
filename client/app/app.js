(function() {
  'use strict';
  angular.module('smstudios', [
    // Angular libaries
    'ui.router',

    // Componenets
    'landingController',
    'loginController',
    'homeController',

    // Shared
    'authFactory'
  ])
  .config(config)
  .run(run);

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];


  function config($stateProvider, $urlRouterProvider, $locationProvider) {
    
    $locationProvider.html5Mode(true);
    // Default to index view if the URL loaded is not found
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('landing', {
        url: '/',
        authenticate: false,
        views: {
          content: {
            templateUrl: 'app/components/landing/landing.html',
            controller: 'landingController'
          }
        }
      })
      .state('login', {
        url: '/login',
        authenticate: false,
        views: {
          content: {
            templateUrl: 'app/components/login/login.html',
            controller: 'loginController'
          }
        }
      }).state('home', {
        url: '/private/home',
        authenticate: true,
        views: {
          content: {
            templateUrl: 'app/components/home/home.html',
            controller: 'homeController'
          }
        }
      });
  }

  function run($rootScope, $state, authFactory) {

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (toState.authenticate && !authFactory.loggedIn()) {
        if (window.location.pathname.indexOf('private') !== -1) {
          $state.go('login');
          event.preventDefault();
        } else {
          $state.go('landing');
          event.preventDefault();
        }
      }
    });
    
  }
})();