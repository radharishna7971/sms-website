(function() {
  'use strict';
  angular.module('dataEntryController', ['talentFactory'])
  .controller('dataEntryController', function($scope, talentFactory) {
    $scope.section = 'Talent';

    $scope.updateActiveSection = function($event, section) {
      $('.data-left-column-div').removeClass('active-data-entry-link');
      $($event.target).addClass('active-data-entry-link');
      $scope.section = section;
    }
  });
})();