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
        activeElementSetter[$scope.section]();
      }
     
    }

    // This contains functions for fetching the data to the forms for editing
    var activeElementSetter = {
      Role: function() {
        $scope.editElement = $scope.editElement;
        for (var key in $scope.editElement) {
          $scope.activeElement[key] = $scope.editElement[key];
        }
      },
      Genre: function() {
        $scope.editElement = $scope.editElement;
        for (var key in $scope.editElement) {
          $scope.activeElement[key] = $scope.editElement[key];
        }
      },
      Credit: function() {
        creditFactory.getCredit($scope.editElement.id, function(creditData) {
          // format the date
          creditData.release_date = new Date(creditData.release_date);
          $scope.activeElement = creditData;
        });
      }
    }

    var dataSubmitter = {
      Role: function() {
        if (!checkInputs()) {
           $scope.errorText = 'Please make sure all required fields are entered';
        } else {
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
        }
      },
      Genre: function() {
        if (!checkInputs()) {
           $scope.errorText = 'Please make sure all required fields are entered';
        } else {
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
      },
      Credit: function() {
        if (!checkInputs()) {
           $scope.errorText = 'Please make sure all required fields are entered';
        } else {
          $scope.errorText = '';
          creditFactory.addOrEdit($scope.activeElement, function(res) {
            if (res.status === 'error') {
              $scope.errorText = res.text;
            } else if (res.status === 'edit') {
              $scope.editElement.name = $scope.activeElement.name;
            } else {
              // Add new genre to list and reset active genre
              console.log("AAAA", res);
              $scope.data[$scope.section].push(res);
              $scope.editElement = {};
              $scope.activeElement = {};
            }
          })
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

    // Ensures all required inputs have data
    var checkInputs = function() {
      var result = true;
      $('input:visible').each(function() {
          if ($(this).attr('required')) {
            if ($(this).val().length === 0) {
              result = false;
            }
          }
      });
      return result;
    }


    $scope.submitData = function() {
      dataSubmitter[$scope.section]();
    }
  });
})();