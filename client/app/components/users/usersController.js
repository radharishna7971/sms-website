(function() {
  'use strict';
  angular.module('usersController', ['authFactory'])
  .controller('usersController', function($scope, authFactory) {
    authFactory.getUsers(function(users) {
      $scope.users = users;
    });
  });
})();