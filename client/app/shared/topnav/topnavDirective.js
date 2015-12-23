(function() {
  'use strict';
  angular.module('topnavDirective', ['authFactory'])
  .directive('topnav', function($location) {
    return {
      restrict: "E",
      templateUrl: 'app/shared/topnav/topnav.html',
      controller: function($scope, $rootScope, authFactory) {
		  if(!!window.localStorage.smstudiosLoginUserName){
			  $scope.display_username = window.localStorage.smstudiosLoginUserName;
			  $scope.last_logged_in = window.localStorage.smstudiosLastLoggedIn;
		  }
    	  $scope.logout = function() {
    		  authFactory.logout();
    	  };


      },
      link: function() {

        var startPath = window.location.pathname.split('/')[2];
          console.log(startPath);
        $('.topnav-button').on('click', function() {
          $('.active-page').removeClass('active-page');
          $(this).addClass('active-page');
        });
        
        // Remove links that user does not have privilege to access
        $('.topnav-button').each(function() {
          // If user permission level is above the required permission for a given link, hide the link
          if (parseInt(window.localStorage.smstudiosPermission) > parseInt($(this).attr('permission'))) {
            $(this).remove();
          }
          
          // Highlights initial active page
          if ($(this).attr('path') === startPath) {

            $(this).addClass('active-page');
          }
        });
      }
    };
  });
  
})();