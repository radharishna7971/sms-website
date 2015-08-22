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
    'authFactory',
    'topnavDirective'
  ])
  .config(config)
  .run(run);

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];


  function config($stateProvider, $urlRouterProvider, $locationProvider, $state, authFactory) {
    
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
        },
        resolve: {
          /* Redirect to home page if user is already logged in */
          loggedIn: function(authFactory, $location) {
            if (authFactory.loggedIn()) {
              $location.path('/private/home');
            }
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

  function run($rootScope, $state, authFactory, topnavDirective) {
    /* If user is not logged in, redirect to home page if private is not in url, otherwise redirect to login */
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (toState.authenticate && !authFactory.loggedIn()) {
          $state.go('landing');
      } else if (toState.authenticate) {
        $('#topnav').show();
      }
    });
    
  }
})();