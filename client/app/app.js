(function() {
  'use strict';
  angular.module('smstudios', [
    // Angular libaries
    'ui.router',

    // Componenets
    'landingController',
    'loginController',
    // 'homeController',
    'talentController',
    'usersController',
    'dataEntryController',
    // 'youtubeController',


    // Shared
    'authFactory',
    'talentFactory',
    'contactFactory',
    'creditFactory',
    'roleFactory',
    'genreFactory',
    // 'youtubeFactory',
    'commentFactory',
    'topnavDirective'
  ])
  .config(config)
  .run(run);

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];


  function config($stateProvider, $urlRouterProvider, $locationProvider, $state) {
    
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
        redirect: true,
        views: {
          content: {
            templateUrl: 'app/components/login/login.html',
            controller: 'loginController'
          }
        }
      // }).state('home', {
      //   url: '/private/home',
      //   authenticate: true,
      //   views: {
      //     content: {
      //       templateUrl: 'app/components/home/home.html',
      //       controller: 'homeController'
      //     }
      //   }
      }).state('talent', {
        url: '/private/talent',
        authenticate: true,
        views: {
          content: {
            templateUrl: 'app/components/talent/talent.html',
            controller: 'talentController'
          }
        }
      }).state('data', {
        url: '/private/data-entry',
        authenticate: true,
        params : {section: null, id: null},
        views: {
          content: {
            templateUrl: 'app/components/dataEntry/dataEntry.html',
            controller: 'dataEntryController'
          }
        }
      // }).state('youtube', {
      //   url: '/private/youtube',
      //   authenticate: true,
      //   views: {
      //     content: {
      //       templateUrl: 'app/components/youtube/youtube.html',
      //       controller: 'youtubeController'
      //     }
      //   }
      }).state('users', {
        url: '/private/users',
        authenticate: true,
        views: {
          content: {
            templateUrl: 'app/components/users/users.html',
            controller: 'usersController'
          }
        },
        resolve: {
          checkUserCreationAccess: function() {
            if (parseInt(window.localStorage.smstudiosPermission) > 1) {
              console.log("A");
              $state.go('talent');
            } else {
              console.log("B");
            }
          }
        }
      });
  }

  function run($rootScope, $state, authFactory, topnavDirective, $location) {
    // If user is not logged in, redirect to home page if private is not in url, otherwise redirect to login 
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      authFactory.loggedIn(function(status) {
        // If state requires authentication and user is not authenticated, redirect to landing
        if (toState.authenticate && !status) {
          $location.path('landing');
        // If state should redirect if user is logged in and user is logged in
        } else if (toState.redirect && status) {
          $location.path('private/talent');
        // Else show top nav
        } else if (toState.authenticate) {
          $('#topnav').show();
        }
      });
    });
    
  }
})();