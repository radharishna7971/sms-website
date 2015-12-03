(function() {
  'use strict';
  angular.module('dataEntryController', ['talentFactory', 'contactFactory', 'creditFactory', 'roleFactory', 'genreFactory', 'creditTypeFactory', 'commentFactory', 'ethnicityFactory'])
  .controller('dataEntryController', function($scope, $stateParams, talentFactory, contactFactory, creditFactory, roleFactory, genreFactory, creditTypeFactory, commentFactory, ethnicityFactory) {
    $scope.section = 'Talent'; // Represents current section
    $scope.talentSection = 'main'; // Represents the visible section of talent form
    $scope.errorText = ''; // error text for form
    $scope.activeElement = {}; // data that will change in form
    $scope.activeElement.talentCreditJoins = {};
    $scope.editElement = null; // contains data for element whose data is being edited in the form
    $scope.filterData = 'last_name';

    // Whenever a new section (category) is clicked, this updated the highlighte div, the form and the data shown
    $scope.updateActiveSection = function($event, section) {
      // Remove active element
      $scope.editElement = null;
      $scope.activeElement = {};
      $scope.errorText = '';
      $scope.section = section;
      $scope.talentSection = 'main';
      $scope.activeData = $scope.data[$scope.section];
      $scope.btnTxt = "Add";	

      if ($event) {
        $('.data-left-column-categories-div').removeClass('active-data-right-column-link');
        $($event.target).addClass('active-data-right-column-link');
        
        // Sort all data types by name except for talent which is sorted by last name
        $scope.filterData = 'name';

        // Update form centering for talent form
        if ($scope.section === 'Talent') {
          $scope.filterData = 'last_name';
          $('.data-form-container').css('width', '530px');
        } else {
          $('.data-form-container').css('width', '260px');
        }
      }
    };

    $scope.updateTalentForm = function($event) {
      if (!$($event.target).hasClass('talent-form-menu-button-inactive')) {
        $('.talent-form-menu-button-active').removeClass('talent-form-menu-button-active');
        $($event.target).addClass('talent-form-menu-button-active');
        $scope.talentSection = $($event.target).attr('talent-form-section');
        if ($scope.section !== 'main') {
          $scope.errorText = 'Modifying ' + $scope.activeElement.first_name + ' ' + $scope.activeElement.last_name;
		  $scope.btnTxt = "Update";
        }
      }
    };

    $scope.setActiveElement = function($event, element) {
      $scope.errorText = '';
      $scope.talentSection = 'main';

      // if element clicked is currently active, make it inactive and clear out form data
      if ($($event.target).hasClass('active-element')) {
        $scope.editElement = null;
        $scope.activeElement = {};
		    $scope.btnTxt = "Add";		
      } 
      // otherwise, remove active from other element in case another element is active and set form data
      else {
        $('.active-element').removeClass('active-element');
        $scope.editElement = element;
        activeElementSetter[$scope.section]();
		    $scope.btnTxt = "Update";
      }
    };

    $scope.deleteElement = function() {
      var dataType = $scope.section.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); });
      if (confirm("Are you sure you want to delete this" + dataType + "?")) {
        deleteData[$scope.section]();
      }
    };

    $scope.clearForm = function() {
      $scope.editElement = null;
      $scope.activeElement = {};
      $scope.talentSection = 'main';
	   $scope.btnTxt = "Add";
    };

    // This contains functions for fetching the data to the forms for editing
    var activeElementSetter = {
      Role: function() {
        for (var key in $scope.editElement) {
          $scope.activeElement[key] = $scope.editElement[key];
        }
      },
      Ethnicity: function() {
        for (var key in $scope.editElement) {
          $scope.activeElement[key] = $scope.editElement[key];
        }
      },
      Genre: function() {
        for (var key in $scope.editElement) {
          $scope.activeElement[key] = $scope.editElement[key];
        }
      },
      CreditType: function() {
        for (var key in $scope.editElement) {
          $scope.activeElement[key] = $scope.editElement[key];
        }
      },
      Credit: function() {
        creditFactory.getCredit($scope.editElement.id, function(creditData) {
          $scope.activeElement = creditData;
        });
      },
      Contact: function() {
        contactFactory.getContact($scope.editElement.id, function(contactData) {
          $scope.activeElement = contactData;
        });
      },
      Talent: function() {
        talentFactory.getTalent($scope.editElement.id, function(talentData) {
          $scope.activeElement = talentData;
        });
      }
    };

    // This contains functions for submitting data to the database
    var dataSubmitter = {
      Role: function() {
        if (!checkInputs()) {
           $scope.errorText = 'Please make sure all required fields are entered';
        } else {
          $scope.errorText = '';
          roleFactory.addOrEdit($scope.activeElement, function(res) {
            if (res.status !== 'error') {
              if (res.status === 'edit') {
                $scope.editElement.name = res.name;
              } else {
                $scope.data[$scope.section].push(res);
                $scope.editElement = res;
                activeElementSetter[$scope.section]();
				        $scope.btnTxt = "Update";				
              }
            }
            $scope.errorText = res.text;
          });
        }
      },
	  Ethnicity: function() {
        if (!checkInputs()) {
           $scope.errorText = 'Please make sure all required fields are entered';
        } else {
          $scope.errorText = '';
          ethnicityFactory.addOrEdit($scope.activeElement, function(res) {
            if (res.status !== 'error') {
              if (res.status === 'edit') {
                $scope.editElement.name = res.name;
              } else {
                $scope.data[$scope.section].push(res);
                $scope.editElement = res;
                activeElementSetter[$scope.section]();
				$scope.btnTxt = "Update";				
              }
            }
            $scope.errorText = res.text;
          });
        }
      },
      Genre: function() {
        if (!checkInputs()) {
           $scope.errorText = 'Please make sure all required fields are entered';
        } else {
          $scope.errorText = '';
          genreFactory.addOrEdit($scope.activeElement, function(res) {
            if (res.status !== 'error') {
              if (res.status === 'edit') {
                $scope.editElement.name = res.name;
              } else {
                $scope.data[$scope.section].push(res);
                $scope.editElement = res;
                activeElementSetter[$scope.section]();
				$scope.btnTxt = "Update";				
              }
            }
            $scope.errorText = res.text;
          });
        }
      },
      CreditType: function() {
        if (!checkInputs()) {
           $scope.errorText = 'Please make sure all required fields are entered';
        } else {
          $scope.errorText = '';
          creditTypeFactory.addOrEdit($scope.activeElement, function(res) {
            if (res.status !== 'error') {
              if (res.status === 'edit') {
                $scope.editElement.name = res.name;
              } else {
                $scope.data[$scope.section].push(res);
                $scope.editElement = res;
                activeElementSetter[$scope.section]();
				        $scope.btnTxt = "Update";				
              }
            }
            $scope.errorText = res.text;
          });
        }
      },
      Credit: function() {
        if (!checkInputs()) {
           $scope.errorText = 'Please make sure all required fields are entered';
        } else {
          // Set blank values to null so they can be properly saved in database
          for (var key in $scope.activeElement) {
            if (!$scope.activeElement[key]) {
              $scope.activeElement[key] = null;
            }
          }
          $scope.errorText = '';
          creditFactory.addOrEdit($scope.activeElement, function(res) {
            if (res.status !== 'error') {
              if (res.status === 'edit') {
                $scope.editElement.name = res.name;
              } else {
                $scope.data[$scope.section].push(res);
                $scope.editElement = res;
                activeElementSetter[$scope.section]();
				$scope.btnTxt = "Update";				
              }
            }
            $scope.errorText = res.text;
          });
        }
      },
      Contact: function() {
        if (!checkInputs()) {
          $scope.errorText = 'Please make sure all required fields are entered';
        } else {

          // Set blank values to null so they can be properly saved in database
          for (var key in $scope.activeElement) {
            if (!$scope.activeElement[key]) {
              $scope.activeElement[key] = null;
            }
          }

          $scope.errorText = '';
          contactFactory.addOrEdit($scope.activeElement, function(res) {
            if (res.status !== 'error') {
              if (res.status === 'edit') {
                $scope.editElement.name = res.name;
              } else {
                $scope.data[$scope.section].push(res);
                $scope.editElement = res;
                activeElementSetter[$scope.section]();
				        $scope.btnTxt = "Update";				
              }
            }
            $scope.errorText = res.text;
          });
        }
      },
      Talent: function() {
        if (!checkInputs('talent')) {
          $scope.errorText = 'Please make sure all required fields are entered';
        } else {
          // Set blank values to null so they can be properly saved in database
          for (var key in $scope.activeElement) {
            if (!$scope.activeElement[key]) {
              $scope.activeElement[key] = null;
            }
          }

          if (!$scope.activeElement.created_by) {
            $scope.activeElement.created_by = window.localStorage.smstudiosId;
          }

          // Add id to keep track of who created given talent
          $scope.activeElement.last_edited_by = window.localStorage.smstudiosId;

          talentFactory.addOrEdit($scope.activeElement, function(res) {
            if (res.status !== 'error') {
              if (res.status === 'edit') {
                $scope.editElement.name = res.name;
              } else {
                $scope.data[$scope.section].push(res);
                $scope.editElement = res;
                activeElementSetter[$scope.section]();
				        $scope.btnTxt = "Update";				
              }
            }
            $scope.errorText = res.text;
          });
        }
      }
    };

    $scope.submitTalentCreditData = function() {
      var credits = $('.talent-credit-select').val();
      var role = $('.talent-credit-role-select').val() || null;

      talentFactory.addTalentCreditJoin($scope.editElement.id, credits, role, function(data) {
        if (data.length !== $scope.activeElement.talentCreditJoins.length) {
          $scope.errorText = 'Credit(s) added to ' + $scope.activeElement.first_name + ' ' + $scope.activeElement.last_name;
          $scope.activeElement.talentCreditJoins = data;
        } else {
          $scope.errorText = 'Credit(s) already exists';
        }
      });
    };

    $scope.removeTalentCreditJoin = function($event, join_id) {
      talentFactory.removeTalentCreditJoin(join_id, function(data) {
        $($event.target).parent().slideUp();
        $($event.target).parent().remove();
        $scope.errorText = 'Credit removed from ' + $scope.activeElement.first_name + ' ' + $scope.activeElement.last_name;
        $scope.activeElement.talentCreditJoins = data;
      });
    }

    // This contains functions for removing data from the database
    var deleteData = {
      Role: function() {
        roleFactory.deleteRole($scope.editElement.id, function(){
          // Remove deleted data point from the array
          $scope.data[$scope.section].splice($scope.data[$scope.section].indexOf($scope.editElement), 1);

          // Reset elements and form
          $scope.editElement = null;
          $scope.activeElement = {};
		  $scope.btnTxt = "Add";		  
        });
      },
      Ethnicity: function() {
        ethnicityFactory.deleteEthnicity($scope.editElement.id, function(){
          // Remove deleted data point from the array
          $scope.data[$scope.section].splice($scope.data[$scope.section].indexOf($scope.editElement), 1);

          // Reset elements and form
          $scope.editElement = null;
          $scope.activeElement = {};
		  $scope.btnTxt = "Add";		  
        });
      },
      Genre: function() {
        genreFactory.deleteGenre($scope.editElement.id, function(){
          // Remove deleted data point from the array
          $scope.data[$scope.section].splice($scope.data[$scope.section].indexOf($scope.editElement), 1);

          // Reset elements and form
          $scope.editElement = null;
          $scope.activeElement = {};
		  $scope.btnTxt = "Add";		  
        });
      },
      CreditType: function() {
        creditTypeFactory.deleteCreditType($scope.editElement.id, function(){
          // Remove deleted data point from the array
          $scope.data[$scope.section].splice($scope.data[$scope.section].indexOf($scope.editElement), 1);

          // Reset elements and form
          $scope.editElement = null;
          $scope.activeElement = {};
		  $scope.btnTxt = "Add";		  
        });
      },
      Credit: function() {
        creditFactory.deleteCredit($scope.editElement.id, function(){
          // Remove deleted data point from the array
          $scope.data[$scope.section].splice($scope.data[$scope.section].indexOf($scope.editElement), 1);

          // Reset elements and form
          $scope.editElement = null;
          $scope.activeElement = {};
		  $scope.btnTxt = "Add";
        });
      },
      Contact: function() {
        contactFactory.deleteContact($scope.editElement.id, function(){
          // Remove deleted data point from the array
          $scope.data[$scope.section].splice($scope.data[$scope.section].indexOf($scope.editElement), 1);

          // Reset elements and form
          $scope.editElement = null;
          $scope.activeElement = {};
		  $scope.btnTxt = "Add";
        });
      },
      Talent: function() {
        talentFactory.deleteTalent($scope.editElement.id, function(){
          // Remove deleted data point from the array
          $scope.data[$scope.section].splice($scope.data[$scope.section].indexOf($scope.editElement), 1);

          // Reset elements and form
          $scope.editElement = null;
          $scope.activeElement = {};
		  $scope.btnTxt = "Add";
        });
      }
    };

    // storage for all data points that are added or pulled from database
    $scope.data = {
      Contact: contactFactory.getNames(function(result) {
        $scope.data.Contact = result;
      }),
      Credit: creditFactory.getNames(function(result) {
        $scope.data.Credit = result;
      }),
      Role: roleFactory.getNames(function(result) {
        $scope.data.Role = result;
      }),
      Ethnicity: ethnicityFactory.getNames(function(result) {
        $scope.data.Ethnicity = result;
      }),
      Genre: genreFactory.getNames(function(result) {
        $scope.data.Genre = result;
      }),
      CreditType: creditTypeFactory.getNames(function(result) {
        $scope.data.CreditType = result;
      }),
      Talent: talentFactory.getNames(function(result) {
        $scope.data.Talent = result;
        // Set talent data to active data when page loads
        $scope.activeData = $scope.data.Talent;
      })
    };

    setTimeout(function() {
      console.log($scope.data);
    }, 2000);

    // Ensures all required inputs have data
    // Takes in an optional section.  If section is passed in, it means it is part of the talent form.  This is done to handle that fact that some required inputs might be hidden
    var checkInputs = function(section) {
      var result = true;
      if (!section) {
        $('input:visible, select:visible').each(function() {
          if ($(this).attr('required')) {
            if ($(this).val() === null || $(this).val().length === 0) {
              result = false;
            }
          }
        });
      } else {
        $('.talent-form').find('input, visible').each(function() {
          if ($(this).attr('required')) {
            if ($(this).val() === null || $(this).val().length === 0) {
              result = false;
            }
          }
        });
      }
      
      return result;
    };


    $scope.submitData = function() {
      dataSubmitter[$scope.section]();
    };

    // If parameter data is passed in, we want to show the right data when the page loads
    if (!!$stateParams.section) {
      // Set section and element id, push data into form
      $scope.section = $stateParams.section;
      $scope.editElement = {id: $stateParams.id};
      activeElementSetter[$scope.section]();

    // Otherwise show Talent by default
    } else {
      // Temporary work around for getting Talent data to show on load
      setTimeout(function() {
        $scope.updateActiveSection(null, 'Talent');
        $scope.$apply();
      }, 200);
    }

    // Submit comment
    $scope.submitComment = function() {
      // If text is in the textarea, submit the new comment
      if ($('.data-entry-comment-input').val() !== "") {
        commentFactory.addComment($('.data-entry-comment-input').val(), $scope.activeElement.id, function(result) {
          $scope.activeElement.comments.push(result);
          //Once comment is added, append it to the comments-container and clear the textarea
          $('.data-entry-comment-input').val('');
        });
      }
    };

    // Remove comment when delete button is clicked
    $scope.removeComment = function($event, comment_id) {
      $($event.target).parent().slideUp();
      commentFactory.removeComment(comment_id);
    };
  });
})();