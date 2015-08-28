(function() {
  'use strict';
  angular.module('talentController', ['talentFactory'])
  .controller('talentController', function($scope, talentFactory) {
    talentFactory.getAll(function(data) {
      $scope.talent = data;
    });
    $scope.mainTalent = false;
    $scope.activeSection = 'info';
    $scope.updateMainTalent = function(talentId) {
      talentFactory.talentProfile(talentId, function(result) {
        $scope.mainTalent = result;
      });
    };
    $scope.updateTalentSection = function($event, section) {
      // console.log($event.target);
      $('.right-talent-container-menu-link').removeClass('active-talent-link');
      $($event.target).addClass('active-talent-link')
      $scope.activeSection = section;
    }
  });
})();