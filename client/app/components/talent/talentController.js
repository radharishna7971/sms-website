(function() {
  'use strict';
  angular.module('talentController', ['talentFactory', 'contactFactory', 'roleFactory', 'genreFactory'])
  .controller('talentController', function($scope, talentFactory, contactFactory, creditFactory, roleFactory, genreFactory) {
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
      $('.right-talent-container-menu-link').removeClass('active-talent-link');
      $($event.target).addClass('active-talent-link');
      $scope.activeSection = section;
    };

    $scope.updateFiltersClick = function($event) {
      // When a filter is clicked, toggle it's status
      $scope.filterData[$($event.target).attr('col')][$($event.target).attr('value')] = !$scope.filterData[$($event.target).attr('col')][$($event.target).attr('value')];
    };

    $scope.updateFiltersKeyUp = function($event) {
      $scope.filterData[$($event.target).attr('col')] = $($event.target).val();
    };

    $scope.filterData = {
      name: "",
      location: "",
      primary_role: {},
      secondary_role: {},
      primary_genre: {},
      secondary_genre: {},
      sex: {male: false, female: false}
    };

    // Storage for all data points for filters
    $scope.data = {
      Role: roleFactory.getNames(function(result) {
        $scope.data.Role = result;
        $scope.activeData = $scope.data.Role;

        // Add data into filter object
        for (var i = 0; i < result.length; i++) {
          $scope.filterData['primary_role'][result[i].name] = false;
          $scope.filterData['secondary_role'][result[i].name] = false;
        }
      }),
      Genre: genreFactory.getNames(function(result) {
        $scope.data.Genre = result;
        $scope.activeData = $scope.data.Genre;

        // Add data into filter object
        for (var i = 0; i < result.length; i++) {
          $scope.filterData['primary_genre'][result[i].name] = false;
          $scope.filterData['secondary_genre'][result[i].name] = false;
        }
      })
    };

    // Toggles all checkboxes to true
    $scope.checkAll = function() {
      $('.filter-option').prop('checked', true);
      for (var col in $scope.filterData) {
        if(typeof($scope.filterData[col]) === "object") {
          for (var elem in $scope.filterData[col]) {
            $scope.filterData[col][elem] = true;
          }
        }
      }
    };

    // Toggles all checkboxes to false
    $scope.uncheckAll = function() {
      $('.filter-option').prop('checked', false);
      for (var col in $scope.filterData) {
        if(typeof($scope.filterData[col]) === "object") {
          for (var elem in $scope.filterData[col]) {
            $scope.filterData[col][elem] = false;
          }
        }
      }
    };

    // Determines whether a talent matches text in Name or Location (if these fields are not blank)
    var textChecker = function(talent) {
      // If text is inputted for name it it isn't a match, return false
      if ($scope.filterData['name'].length > 0  && talent.name.toLowerCase().indexOf($scope.filterData['name'].toLowerCase()) === -1) {
        return false;
      }

      // If text is inputted for location it it isn't a match, return false
      if ($scope.filterData['location'].length > 0  && talent.location.toLowerCase().indexOf($scope.filterData['location'].toLowerCase()) === -1) {
        return false;
      }

      // Otherwise, it's a valid match
      return true;
    };

    // Filter for talent
    $scope.talentFilter = function(talent) {
      return textChecker(talent) &&
        ($scope.filterData['sex'][talent.gender] ||
        $scope.filterData['primary_role'][talent.primary_role] ||
        $scope.filterData['secondary_role'][talent.secondary_role] ||
        $scope.filterData['primary_genre'][talent.primary_genre] ||
        $scope.filterData['secondary_genre'][talent.secondary_genre]);
    };
  });
})();