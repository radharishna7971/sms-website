(function() {
  'use strict';
  angular.module('topnavDirective', ['authFactory'])
  .directive('topnav', function() {
    return {
      restrict: "E",
      templateUrl: 'app/shared/topnav/topnav.html',
      controller: function($scope, $rootScope, authFactory) {
        $scope.logout = function() {
          authFactory.logout();
        };
      }
    };
  });
  
})();