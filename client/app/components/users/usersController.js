(function() {
  'use strict';
  angular.module('usersController', ['authFactory'])
  .controller('usersController', function($scope, authFactory) {
    authFactory.getUsers(function(users) {
      $scope.users = users;
    });

    $scope.userData = {};
    $scope.errorText = '';

    $scope.createUser = function() {
      if (!checkInputs()) {
        $scope.errorText = "Please fill in all fields";
      } else if ( $scope.userData.password !== $scope.confirmPassword) {
        $scope.errorText = "Please make sure passwords match";
      } else if ($scope.userData.password.length < 7) {
        $scope.errorText = "Password must be at least seven characters long";
      } else {

        authFactor.crea
      }
    };

    // Ensures all required inputs have data
    // Takes in an optional section.  If section is passed in, it means it is part of the talent form.  This is done to handle that fact that some required inputs might be hidden
    var checkInputs = function() {
      var result = true;
      $('input').each(function() {
        if ($(this).attr('required')) {
          if ($(this).val() === null || $(this).val().length === 0) {
            result = false;
          }
        }
      });

      return result;
    };
  });
})();