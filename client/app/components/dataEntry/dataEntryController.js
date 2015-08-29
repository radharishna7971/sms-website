(function() {
  'use strict';
  angular.module('dataEntryController', ['talentFactory', 'contactFactory', 'creditFactory', 'roleFactory', 'genreFactory'])
  .controller('dataEntryController', function($scope, talentFactory, contactFactory, creditFactory, roleFactory, genreFactory) {
    $scope.section = 'Talent'; // Represents current section
    $scope.errorText = ''; // error text for form
    $scope.activeElement = {}; // data that will change in form
    $scope.editElement = {} // contains data for element whose data is being edited in the form
 
    // Whenever a new section (category) is clicked, this updated the highlighte div, the form and the data shown
    $scope.updateActiveSection = function($event, section) {
      $('.data-left-column-categories-div').removeClass('active-data-right-column-link');
      $($event.target).addClass('active-data-right-column-link');
      // Remove active element
      $scope.editElement = {};
      $scope.activeElement = {};
      $scope.errorText = '';
      $scope.section = section;
      $scope.activeData = $scope.data[$scope.section]
    }

    $scope.setActiveElement = function($event, element) {
      $scope.errorText = '';

      // if element clicked is currently active, make it inactive and clear out form data
      if ($($event.target).hasClass('active-element')) {
        $($event.target).removeClass('active-element');
        $scope.editElement = {};
        $scope.activeElement = {};
      } 
      // otherwise, remove active from other element in case another element is active and set form data
      else {
        $('.active-element').removeClass('active-element')
        $($event.target).addClass('active-element')

        $scope.editElement = element;
        for (var key in element) {
          $scope.activeElement[key] = element[key];
        }
      }
     
    }


    
    // storage for all data points that are added or pulled from database
    $scope.data = {
      Contact: contactFactory.getNames(function(result) {
        $scope.data.Contact = result;
        $scope.activeData = $scope.data.Contact;
      }),
      Credit: creditFactory.getNames(function(result) {
        $scope.data.Credit = result;
        $scope.activeData = $scope.data.Credit;
      }),
      Role: roleFactory.getNames(function(result) {
        $scope.data.Role = result;
        $scope.activeData = $scope.data.Role;
      }),
      Genre: genreFactory.getNames(function(result) {
        $scope.data.Genre = result;
        $scope.activeData = $scope.data.Genre;
      }),
      Talent: talentFactory.getNames(function(result) {
        $scope.data.Talent = result;
        $scope.activeData = $scope.data.Talent;
      })
    }


    var dataSubmitter = {
      Role: function() {
        $scope.errorText = '';
        roleFactory.addOrEdit($scope.activeElement, function(res) {
          if (res.status === 'error') {
            $scope.errorText = res.text;
          } else if (res.status === 'edit') {
            $scope.editElement.name = $scope.activeElement.name;
          } else {
            // Add new role to list and reset active role
            $scope.data[$scope.section].push(res);
            $scope.editElement = {};
            $scope.activeElement = {};
          }
        });
      },
      Genre: function () {
        $scope.errorText = '';
        genreFactory.addOrEdit($scope.activeElement, function(res) {
          if (res.status === 'error') {
            $scope.errorText = res.text;
          } else if (res.status === 'edit') {
            $scope.editElement.name = $scope.activeElement.name;
          } else {
            // Add new genre to list and reset active genre
            $scope.data[$scope.section].push(res);
            $scope.editElement = {};
            $scope.activeElement = {};
          }
        });
      }
    }


    $scope.submitData = function() {
      dataSubmitter[$scope.section]();
    }
  });
})();