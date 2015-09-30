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

      /* Returns true or false depending on whether the current user is logged in. A user is logged in */
      loggedIn: function(callback) {
        // if no token exists in local storage, user is not logged in
        if (!window.localStorage.smstudiosJwtToken) {
          callback(false);
        } else {
          $http({
            method: 'POST',
            url: 'api/auth/validate',
            data: {
              token: window.localStorage.smstudiosJwtToken
            }
          }).then(function(res) {
            // If token is invalid, delete it
            if (!res.data) {
              delete window.localStorage.smstudiosJwtToken;
            }
            callback(res.data);
          });
        }
      },

      /* When user logs out, remove the token from client and redirect to home page */
      logout: function() {
        delete window.localStorage.smstudiosJwtToken;
        $state.go('login');
      },

      createUser: function(userData) {
        $http({
          method: 'POST',
          url: 'api/auth/create',
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            password: userData.password
          }
        }).then(function(res) {
          return "Successfully created new user";
          }, function() {
          return "Unable to create new user";
        });
      },

      getUsers: function(callback) {
        $http({
          method: 'GET',
          url: 'api/auth/users',
          params: {
            token: window.localStorage.smstudiosJwtToken
          }
        }).then(function(res) {
          callback(res.data);
          }, function() {
          return "Unable to create new user";
        });
      }
    };
  });
})();