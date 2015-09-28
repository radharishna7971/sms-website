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
      },
      link: function() {
        $('.topnav-button').on('click', function() {
          $('.active-page').removeClass('active-page');
          $(this).addClass('active-page');
        });
      }
    };
  });
  
})();