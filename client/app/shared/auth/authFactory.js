(function() {
  'use strict';
  angular.module('authFactory', [])
  .factory('authFactory', function($http, $state) {
    return {
      login: function(email, password) {
        return $http({
          method: 'POST',
          url: 'api/auth/login',
          data: {
            email: email,
            password: password
          }
        }).then(function(res) {
            window.localStorage.smstudiosJwtToken = res.data.token;
            $state.go('home');
        }, function() {
            return "Invalid credentials";
        });
      },

      createUser: function(email, password) {
        $http({
          method: 'POST',
          url: 'api/auth/create',
          data: {
            email: email,
            password: password
          }
        }).then(function(res) {
          return "Successfully created new user";
          }, function() {
          return "Unable to create new user";
        });
      },
      /* Returns true or false depending on whether the current user is logged in. A user is logged in */
      loggedIn: function() {
        return !!window.localStorage.smstudiosJwtToken;
      },

      /* When user logs out, remove the token from client and redirect to home page */
      logout: function() {
        delete window.localStorage.smstudiosJwtToken;
        $state.go('login');
      }
    };
  });
})();