(function() {
  'use strict';
  angular.module('homeController', ['talentFactory'])
  .controller('homeController', function($scope, talentFactory) {
    talentFactory.getAll(function(data) {
      $scope.talent = data;
    });
  });
})();