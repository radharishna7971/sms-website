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
            window.localStorage.smstudiosId = res.data.id;
            window.localStorage.smstudiosPermission = res.data.permission;
            window.localStorage.smstudiosLoginUserName = res.data.name;
            window.localStorage.smstudiosLastLoggedIn = res.data.last_logged_in;

            // Remove links that user does not have privilege to access
            $('.topnav-button').each(function() {
              // If user permission level is above the required permission for a given link, hide the link
              if (parseInt(window.localStorage.smstudiosPermission) > parseInt($(this).attr('permission'))) {
                $(this).remove();
              }
            });

            $('.topnav-button[path="talent"]').addClass('active-page');
            $state.go('talent');
        }, function() {
            return "Invalid credentials";
        });
      },

      /* Returns true or false depending on whether the current user is logged in. A user is logged in if there is a valid jwt token saved in local storage*/
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
              delete window.localStorage.smstudiosId;
              delete window.localStorage.smstudiosPermission;
              delete window.localStorage.smstudiosLastLoggedIn;
            }
            callback(res.data);
          });
        }
      },

      /* When user logs out, remove the token from client and redirect to home page */
      logout: function() {
        delete window.localStorage.smstudiosJwtToken;
        delete window.localStorage.smstudiosId;
        delete window.localStorage.smstudiosPermission;
        delete window.localStorage.smstudiosLastLoggedIn;
        $state.go('login');
      },

      createUser: function(userData, callback) {
        $http({
          method: 'POST',
          url: 'api/auth/create',
          data: userData
        }).then(function(res) {
          if (res.data.hasOwnProperty('error')) {
            callback("User already exists");
          } else {
            callback(null, res.data);
          }
        });
      },

        addXlsRecords: function(rowsData, callback) {
          console.log(rowsData);
        $http({
          method: 'POST',
          url: 'api/auth/addRows',
          data: rowsData
        }).then(function(res) {
          if (res.data.hasOwnProperty('error')) {
            callback("error");
          } else {
            callback(null, res.data);
          }
        });
      },

      updateUser: function(userData, callback) {
        $http({
          method: 'POST',
          url: 'api/auth/update',
          data: userData
        }).then(function(res) {

          if (res.data.hasOwnProperty('error')) {
            callback("User update failed");
          } else {
            callback(null, res.data);
          }
        });
      },

       uploadXlsFile: function(callback) {
        $http({
          method: 'POST',
          url: '/api/auth/xlsxFileUpload',
          data: ''
        }).then(function(res) {
          if (res.data.hasOwnProperty('error')) {
            callback("File import failed.");
          } else {
            callback(null, res.data);
          }
        });
      },

      getUserDetails: function(id,callback) {
        $http({
          method: 'GET',
          url: 'api/auth/userDetails',
          params: {
            token: window.localStorage.smstudiosJwtToken,
            id:id
          }
        }).then(function(res) {
          callback(res.data);
          }, function() {
          return "Unable to fatch the record.";
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