(function() {
  'use strict';
  angular.module('homeController', [])
  .controller('homeController', function($scope) {
    $scope.submitEmail = function() {
      var emailSyntax = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

      if (emailSyntax.test($scope.userEmail)) {
        $scope.errorMessage = "";
        $('.email-form').remove();
        $('.email-form-div').append('<p class="success-text">Email successfully submitted</p>')
      } else {
        $scope.errorMessage = "Invalid email.  Please try again!";
      }
    };
  });

})();