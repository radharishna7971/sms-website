(function() {
  'use strict';
  angular.module('loginController', ['authFactory'])
  .controller('loginController', function($scope, authFactory) {

    $scope.login = function() {
      // This is regex to check for valid email
      var emailSyntax = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

      // If the email is submitted, check to see if it is valid
      if (emailSyntax.test($scope.email)) {
        // If it is valid, remove the error message
        $scope.errorMessage = "";
        authFactory.login($scope.email, $scope.password)
        .then(function(res) {
          console.log(res);
        });

      } else {
        // If the message is invalid, show the error message
        $scope.errorMessage = "Invalid email.  Please try again!";
      }
    };
  });
})();