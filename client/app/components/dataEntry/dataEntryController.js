(function() {
  'use strict';
  angular.module('dataEntryController', ['talentFactory', 'contactFactory', 'creditFactory', 'roleFactory', 'genreFactory', 'creditTypeFactory', 'commentFactory', 'ethnicityFactory'])
  .controller('dataEntryController', function($scope,$compile,$timeout, $stateParams, talentFactory, contactFactory, creditFactory, roleFactory, genreFactory, creditTypeFactory, commentFactory, ethnicityFactory) {
    $scope.section = 'Talent'; // Represents current section
    $scope.talentSection = 'main'; // Represents the visible section of talent form
    $scope.errorText = ''; // error text for form
    $scope.activeElement = {}; // data that will change in form
    $scope.activeElementPopUp = {};
    $scope.activeElement.talentCreditJoins = {};
    $scope.editElement = null; // contains data for element whose data is being edited in the form
    $scope.filterData = 'last_name';
    $scope.btnTxtCredit = 'Add';
    $scope.model ={};
    $scope.model.creditsObj = {};
    $scope.addAgentRow = {};
    $scope.talenNameNoResult = null;
    $scope.cmpnyNameNoResult = null;
    $scope.creditsNameNoResult = null;
    $scope.model ={};
    $scope.successmsg = false;
    $scope.isAgentTypeDisabled = false;
    $scope.isCmpnyDisabled = true;
    $scope.isNameDisabled = true;
    $scope.addAgentPanel = true;
    $scope.updateAgentPanel = false;
    $scope.agentNameByType = [];
    $scope.checkSelected = [];
    $scope.selectedGenresNames = [];
    $scope.ativeGenre = {}
    $scope.showGenresOptions = false;
    //creditGenre = [];

    if(!!window.localStorage.smstudiosLoginUserName){
      $scope.data_entry_display_username = window.localStorage.smstudiosLoginUserName;
    }
    //alert(window.localStorage.smstudiosLoginUserName);
    // Whenever a new section (category) is clicked, this updated the highlighte div, the form and the data shown
    $scope.updateActiveSection = function($event, section) {
      // Remove active element
      $scope.editElement = null;
      $scope.activeElement = {};
      $scope.errorText = '';
      $scope.section = section;
      $scope.talentSection = 'main';
      $scope.activeData = $scope.data[$scope.section];

      if(section=='Credit'){
        genreFactory.getNames(function(result) {
            $scope.dataGenre = result;
          });
      }

      $scope.btnTxt = "Add";	
      $scope.model ={};
      if ($event) {
        $('.data-left-column-categories-div').removeClass('active-data-right-column-link');
        $($event.target).addClass('active-data-right-column-link');
        
        // Sort all data types by name except for talent which is sorted by last name
        $scope.filterData = 'name';
         contactFactory.getAssociateType(function(associateTypesData) {
          $scope.typesDetails = associateTypesData;
        });
        // Update form centering for talent form
        if ($scope.section === 'Talent') {
          $scope.filterData = 'last_name';
          $('.data-form-container').css('width', '100%');
        } else {
          $('.data-form-container').css('width', '100%');
        }
      }
    };

    $scope.updateTalentForm = function($event) {
    	$scope.successmsg = false; 
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

    function validateEmail(email) 
    {
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
    }

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
        $scope.model = {};
      }
    };

    $scope.clearForm = function() {
      $scope.editElement = null;
      $scope.activeElement = {};
      $scope.model ={};
      $scope.errorText = '';
      $scope.talentSection = 'main';
      $scope.btnTxt = "Add";
      $scope.selectedGenresNames.length=0;
      if(angular.isDefined($scope.dataGenre)){
          angular.forEach($scope.dataGenre, function(values){
              $scope.checkSelected[values.id] = false;
          });
      }
     
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
              angular.forEach($scope.dataGenre, function(values){
                      $scope.checkSelected[values.id] = false;
              });
            angular.forEach(creditData.genresIds, function(val){
                    $scope.selectedGenresNames.push(val.name);
                    $scope.checkSelected[val.id] = true;
            });
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
          var last_edited_date = talentData['last_edited'].replace ( /[^\d.]/g, '' );
           if(!parseInt(last_edited_date)){
              talentData.last_edited = "";
           }
          creditFactory.getNames(function(result){
            $scope.allCreditsName = result;
          });
          if(!talentData.age){
              talentData.age= "";
            }
          $scope.activeElement = talentData;
          addFetchAssociateName();
        });
      }
    };

    // This contains functions for submitting data to the database
    var dataSubmitter = {
      Role: function() {
        if (!checkInputs()) {
           $scope.errorText = 'Please fill all required fields in correct format';
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
           $scope.errorText = 'Please fill all required fields in correct format';
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
           $scope.errorText = 'Please fill all required fields in correct format';
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
           $scope.errorText = 'Please fill all required fields in correct format';
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
           $scope.errorText = 'Please fill all required fields in correct format';
        } else {
          // Set blank values to null so they can be properly saved in database
          for (var key in $scope.activeElement) {
            if (!$scope.activeElement[key]) {
              $scope.activeElement[key] = null;
            }
          }
          $scope.errorText = '';
          //moment.utc(MYSQL_DATETIME, 'YYYY-MM-DD HH:mm:ss');
          if(angular.isDefined($scope.activeElement.release_date) && $scope.activeElement.release_date!==null){
            $scope.activeElement.release_date =$scope.activeElement.release_date+"-01-01";
          }
          if(angular.isDefined($scope.dataGenre)){
              angular.forEach($scope.dataGenre, function(values){
                if($scope.checkSelected[values.id]){
                  $scope.ativeGenre.creditGenre.push(values.id);
                }
              });
          }
          creditFactory.addOrEdit($scope.activeElement,$scope.ativeGenre.creditGenre, function(res) {
            
            if(angular.isDefined($scope.activeElement.release_date) && $scope.activeElement.release_date!==null){
              var date_array = ($scope.activeElement.release_date).split("-");
              $scope.activeElement.release_date = date_array[0];
            }
            
            if (res.status !== 'error') {
              if (res.status === 'edit') {
                $scope.editElement.name = res.name;
              } else {
                //$scope.activeElement.release_date = ($scope.activeElement.release_date).split("-")[0];
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
      CreditPopUpEntry: function() {
          for (var key in $scope.activeElementPopUp) {
            if (!$scope.activeElementPopUp[key]) {
              $scope.activeElementPopUp[key] = null;
            }
          }
          $scope.errorText = '';
          //moment.utc(MYSQL_DATETIME, 'YYYY-MM-DD HH:mm:ss');
          if(angular.isDefined($scope.activeElementPopUp.release_date) && $scope.activeElementPopUp.release_date!==null){
            $scope.activeElementPopUp.release_date =$scope.activeElementPopUp.release_date+"-01-01";
          }
          
          creditFactory.addOrEdit($scope.activeElementPopUp, function(res) {
            if(angular.isDefined($scope.activeElementPopUp.release_date) && $scope.activeElementPopUp.release_date!==null){
              var date_array = ($scope.activeElementPopUp.release_date).split("-");
              $scope.activeElementPopUp.release_date = date_array[0];
            }
            if (res.status !== 'error') {
                alert(res.text);
                $scope.btnTxtCredit = 'Update';
                $scope.activeElementPopUp.id=res.id;
                $scope.allCreditsName.push($scope.activeElementPopUp);
            }else{
              alert(res.text);
            }
            //$scope.errorText = res.text;
          });
      },
      Contact: function() {
        if (!checkInputs()) {
          $scope.errorText = 'Please fill all required fields in correct format';
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
            $scope.errorText = res.text.replace('cls ,','');
          });
        }
      },
      Talent: function() {
        if (!checkInputs('talent')) {
          $scope.errorText = 'Please fill all required fields in correct format';

        } else {
          if(($scope.activeElement.first_name=="" && $scope.activeElement.last_name =="") || ($scope.activeElement.first_name==null && $scope.activeElement.last_name ==null)){
            $scope.errorText = 'Please fill either firstname or lastname';
            return false;
          }
          // Set blank values to null so they can be properly saved in database
          for (var key in $scope.activeElement) {
            if (!$scope.activeElement[key]) {
              $scope.activeElement[key] = null;
            }
          }
          
          if (!$scope.activeElement.created_by) {
            $scope.activeElement.created_by = window.localStorage.smstudiosId;
          }
          if (!$scope.activeElement.createdby) {
            $scope.activeElement.createdby = window.localStorage.smstudiosLoginUserName;
          }
          if (!$scope.activeElement.createdbycomments) {
            $scope.activeElement.createdbycomments = window.localStorage.smstudiosLoginUserName;
          }
          $scope.activeElement.modifiedby = window.localStorage.smstudiosLoginUserName;
 

          // Add id to keep track of who created given talent
          $scope.activeElement.last_edited_by = window.localStorage.smstudiosId;
          $scope.activeElement.last_edited = moment().format('YYYY-MM-DD HH:mm:ss');
          if(angular.isDefined($scope.activeElement.twitter_url)){
        	  if($scope.activeElement.twitter_url.charAt(0) === '@'){
        		  $scope.activeElement.twitter_url = ($scope.activeElement.twitter_url.replace('@','')).trim(); 
        	  }else{
        		  $scope.activeElement.twitter_url = $scope.activeElement.twitter_url === null?$scope.activeElement.twitter_url:($scope.activeElement.twitter_url).replace("https://www.", '').replace("http://www.", '').replace("http://", '').replace("https://", '').replace("www.", '');
        	  }
          }

          if(angular.isDefined($scope.activeElement.facebook_url)){
        	  if($scope.activeElement.facebook_url.charAt(0) === '@'){
        		  $scope.activeElement.facebook_url = ($scope.activeElement.facebook_url.replace('@','')).trim();
        	  }else{
        		  $scope.activeElement.facebook_url = $scope.activeElement.facebook_url === null?$scope.activeElement.facebook_url:($scope.activeElement.facebook_url).replace("https://www.", '').replace("http://www.", '').replace("http://", '').replace("https://", '').replace("www.", '');
        	  }
          }
        	  
          if(angular.isDefined($scope.activeElement.youtube_url)){
        	  if($scope.activeElement.youtube_url.charAt(0) === '@'){
        		  $scope.activeElement.youtube_url = ($scope.activeElement.youtube_url.replace('@','')).trim();
        	  }else{
        		  $scope.activeElement.youtube_url = $scope.activeElement.youtube_url === null?$scope.activeElement.youtube_url:($scope.activeElement.youtube_url).replace("https://www.", '').replace("http://www.", '').replace("http://", '').replace("https://", '').replace("www.", '');
        	  }
          }
        	  
          if(angular.isDefined($scope.activeElement.vine_url)){
        	if($scope.activeElement.vine_url.charAt(0) === '@'){
        		$scope.activeElement.vine_url = ($scope.activeElement.vine_url.replace('@','')).trim();
        	}else{
        		$scope.activeElement.vine_url = $scope.activeElement.vine_url === null?$scope.activeElement.vine_url:($scope.activeElement.vine_url).replace("https://www.", '').replace("http://www.", '').replace("http://", '').replace("https://", '').replace("www.", '');
        	}
          }
          if(angular.isDefined($scope.activeElement.instagram_url)){
        	  if($scope.activeElement.instagram_url.charAt(0) === '@'){
        		  $scope.activeElement.instagram_url = ($scope.activeElement.instagram_url.replace('@','')).trim();
        	  }else{
        		  $scope.activeElement.instagram_url = $scope.activeElement.instagram_url === null?$scope.activeElement.instagram_url:($scope.activeElement.instagram_url).replace("https://www.", '').replace("http://www.", '').replace("http://", '').replace("https://", '').replace("www.", '');
        	  }
          }

          talentFactory.addOrEdit($scope.activeElement, function(res) {
            if (res.status !== 'error') {
              if (res.status === 'edit') {
                $scope.editElement.name = res.name;
              } else {
                // $scope.data[$scope.section].push(res);
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

    $scope.handleSelect = function($event){
        if (!$event.ctrlKey) {
          if(angular.isDefined($scope.dataGenre)){
              angular.forEach($scope.dataGenre, function(values){
                $scope.checkSelected[values.id] = false;
              });
          }
        }
    };

    $scope.submitTalentCreditData = function() {
         //var credits = $('.talent-credit-select').val();
          var role = $('#roleId').val() || null;
          //$scope.model.CreditInput.id
         
          var credits = [];
           if(angular.isUndefined($scope.model.creditsObj.CreditInputData)){
            alert("Credit(s) is required filed.");
            $("#creditsIds").focus();
            return false;
          }
          else if(role ===null){
            alert("role is required filed.");
            $("#roleId").focus();
            return false;
          }
          var creditsId = $scope.model.creditsObj.CreditInputData;
          credits.push(creditsId);


      talentFactory.addTalentCreditJoin($scope.editElement.id, credits, role, function(data) {
        if (data.length !== $scope.activeElement.talentCreditJoins.length) {
          $scope.errorText = 'Credit(s) added to ' + $scope.activeElement.first_name + ' ' + $scope.activeElement.last_name;
          $scope.activeElement.talentCreditJoins = data;
          $scope.model.creditsObj = {};
        } else {
          $scope.errorText = 'Credit(s) already exists';
        }
      });
    };

    $scope.removeTalentCreditJoin = function($event, join_id) {
      if(confirm("Do you really want to delete this credit?")){
        talentFactory.removeTalentCreditJoin(join_id, function(data) {
          $($event.target).parent().slideUp();
          $($event.target).parent().remove();
          $scope.errorText = 'Credit removed from ' + $scope.activeElement.first_name + ' ' + $scope.activeElement.last_name;
          $scope.activeElement.talentCreditJoins = data;
        });
      }
    };



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
          //$scope.data[$scope.section].splice($scope.data[$scope.section].indexOf($scope.editElement), 1);

          // Reset elements and form
          $scope.editElement = null;
          $scope.activeElement = {};
          $scope.model ={};
          $scope.errorText = '';
		      $scope.btnTxt = "Add";
        });
      }
    };

    var addFetchAssociateName = function(){
      var associateObj = {};
      $scope.associateArray = [];
      $scope.allAgentDetails = [];
      var typeArray = [];
      var agentIDval = -1;
      talentFactory.talentProfile($scope.activeElement.id, function (result) {
        if (!!result.associateInfo && result.associateInfo.length > 0) {
              angular.forEach(result.associateInfo, function (value, key) {
                  associateObj.asdid = value.asdid;
                  associateObj.atypeid = value.atypeid;
                  associateObj.associatename = value.type =="NA"?"":value.type;
                  associateObj.firstname = value.firstName;
                  associateObj.lastname = value.lastName==null || value.lastName=="null"?"":value.lastName;
                  associateObj.fullname = value.firstName=='NA'?"":value.firstName+' '+associateObj.lastname;
                  associateObj.email = value.email=="null" || value.email==null?"":value.email;
                  associateObj.phone = value.phone==null || value.phone=="null"?"":value.phone;
                  associateObj.companyname = value.companyname==null || value.companyname=="null" || value.companyname=="NA"?"":value.companyname;
                  $scope.associateArray.push(associateObj);
                  associateObj = {};
              });
        }
        talentFactory.getAgentDetailsData(agentIDval,function (allAgent) {
          $scope.allAgentDetails = allAgent;
        });

      });
    };

    var getAllAgentNameByType = function(){
       var agentTypeIdVal = parseInt($scope.addAgentRow.type);
      talentFactory.getAgentDetailsData(agentTypeIdVal,function (allAgent) {
          $scope.agentNameByType = allAgent;
          $scope.isNameDisabled = false;
        });
    };
    $scope.getAgentNameByType = function(){
      getAllAgentNameByType();
    };
    $scope.agentDataObj = function(){
      $scope.isCmpnyDisabled = false;
      var agnetNameObj =JSON.parse($scope.addAgentRow.name);
      if(angular.isUndefined(agnetNameObj.companyid) || agnetNameObj.companyid ==""){
        $scope.addAgentRow.companyNameId = "";
      }else{
        $scope.addAgentRow.companyNameId=agnetNameObj.companyid;
      }
      $scope.addAgentRow.Email = agnetNameObj.email==null?"":agnetNameObj.email;
      $scope.addAgentRow.Phone = agnetNameObj.Phone==null?"":agnetNameObj.Phone;
    };

    $scope.getCreditsNames = function(val){
      var talentNames = [];
      return creditFactory.getCreditsNames(val, angular.noop).then(function(result){
          return result.data;
        });
    };


    $scope.selectTaletCmpny = {
        formatNoMatches: function(term) {
            //console.log("Term: " + term);
            var message = '<a ng-click="addTagCmpnyName()" >Add:"' + term + '"</a>';
            if(!$scope.$$phase) {
                $scope.$apply(function() {
                    $scope.cmpnyNameNoResult = term;
                });
            }
            return message;
        }
    };

    $scope.selectTaletAgent = {
        formatNoMatches: function(term) {
            //console.log("Term: " + term);
            var message = '<a ng-click="addTagAgentName()">Add:"' + term + '"</a>';
            if(!$scope.$$phase) {
                $scope.$apply(function() {
                    $scope.talenNameNoResult = term;
                });
            }
            return message;
        }
    };

    $scope.selectCreditsName = {
        formatNoMatches: function(term) {
            //console.log("Term: " + term);
            var message = '<a  id="newCreditTag" ng-click="addNewCreditsNames()">Add:"' + term + '"</a>';
            if(!$scope.$$phase) {
                $scope.$apply(function() {
                    $scope.creditsNameNoResult = term;
                });
            }
            return message;
        }
    };

    $scope.addTagCmpnyName = function() {
        $scope.allAgentDetails.push({
            companyid: $scope.cmpnyNameNoResult+'#newCmpny',
            companyname: $scope.cmpnyNameNoResult
        });
        alert("New company name added into list.");
    };

    $scope.addTagAgentName = function() {
        alert("New agent name added into list.");
        $scope.agentNameByType.push({
            allAgentDetails: $scope.talenNameNoResult+'#newAgent',
            name: $scope.talenNameNoResult
        });
    };

    $scope.addNewCreditsNames = function(){
      $("#creditsCover").show();
      $("#creditsEntryPopUp").show();
      $("#select2-drop").hide();
      $scope.btnTxtCredit = 'Add';
    };
    $scope.closepopup = function(){
      $("#creditsCover").hide();
      $("#creditsEntryPopUp").hide();
      $scope.btnTxtCredit = 'Add';
    };

    $scope.editAgentRecord = function($event,agentId,agentTypeId){
      var getIdsList = {};
      getIdsList['talentID']=$scope.editElement.id;
      getIdsList['agentTypeid']=agentTypeId;
      getIdsList['agentID']=agentId;
      talentFactory.getTalenNamesDataById(getIdsList,function(result) {
              console.log(result);
              $scope.isAgentTypeDisabled = true;
              $scope.isNameDisabled = true;
              $scope.isCmpnyDisabled = false;
              $scope.addAgentPanel = false;
              $scope.updateAgentPanel = true;
              $scope.addAgentRow.updatedNameID = result[0].asdid;
              $scope.addAgentRow.updatedName = result[0].name;
              $scope.addAgentRow.type = result[0].atypeid;    
              $scope.addAgentRow.companyNameId = result[0].companyid;
              $scope.addAgentRow.Email = result[0].email;
              $scope.addAgentRow.Phone = result[0].phone;
        });
    };
    $scope.upDateAgentRow = function(){
      console.log($scope.addAgentRow);
        var dataList = {};
        if($scope.addAgentRow.Email=="" || angular.isUndefined($scope.addAgentRow.Email)){
            dataList['email_id'] = null;
        }else{
            if(validateEmail($scope.addAgentRow.Email)){
              dataList['email_id'] = $scope.addAgentRow.Email;
            }else{
              alert("Please enter valid email Id.");
              return false;
            }
            
        }
        if($scope.addAgentRow.Email=="" || angular.isUndefined($scope.addAgentRow.Email)){
            dataList['phone_num'] = null;
        }else{
           var PhoneNumber = $scope.addAgentRow.Phone.replace(/[\s()-]+/gi, '');
          if(PhoneNumber.length!==10 || isNaN(PhoneNumber)){
            alert("Please enter valid phone number.");
            return false;
          }
            dataList['phone_num'] = $scope.addAgentRow.Phone;
        }
        
        dataList['type'] = $scope.addAgentRow.type;
        dataList['agent_id'] = $scope.addAgentRow.updatedNameID;
        dataList['talentID']=$scope.editElement.id;
        dataList['companynameIdVal']=$scope.addAgentRow.companyNameId;
        talentFactory.updateAgentRowDetailsById(dataList,function(result) {
            if(result.status=="error"){
                alert(result.text);
                 return false;
              }else{
                addFetchAssociateName();
                applyCancel();
                alert(result.text);
                return false;
              }

        });

    };
    var applyCancel = function(){
      $scope.addAgentRow = {};
      $scope.addAgentPanel = true;
      $scope.updateAgentPanel = false;
      $scope.isAgentTypeDisabled = false;
    };
    $scope.cancelAgentRow = function(){
        applyCancel();

    };
    $scope.$watch('talenNameNoResult', function(newVal, oldVal) {
        if(newVal && newVal !== oldVal) {
            $timeout(function() {
                var noResultsLink = $('.select2-no-results');
                console.log(noResultsLink.contents());
                $compile(noResultsLink.contents())($scope);
            });
        }
    }, true);

    $scope.$watch('cmpnyNameNoResult', function(newVal, oldVal) {
        if(newVal && newVal !== oldVal) {
            $timeout(function() {
                var noResultsLink = $('.select2-no-results');
                console.log(noResultsLink.contents());
                $compile(noResultsLink.contents())($scope);
            });
        }
    }, true);

    $scope.$watch('creditsNameNoResult', function(newVal, oldVal) {
        if(newVal && newVal !== oldVal) {
            $timeout(function() {
                var noResultsLink = $('.select2-no-results');
                console.log(noResultsLink.contents());
                $compile(noResultsLink.contents())($scope);
            });
        }
    }, true);

    $scope.removeAgent = function($event,asdid,atypeid){
      if(confirm("Are you sure you want to delete this record?")){
        var indexVal = _.findIndex($scope.associateArray, {'asdid': asdid});
        // $scope.associateArray.splice(indexVal, 1);
        // return false;
        talentFactory.removeTalentAgentJoin($scope.activeElement.id,asdid,atypeid,function(result) {
              $scope.associateArray.splice(indexVal, 1);
        });
      }   
    };

    $scope.clearAgentAddRow = function(){
      $scope.addAgentRow = {};
    };

    $scope.showHideGenres = function($event){
        $scope.showGenresOptions = !$scope.showGenresOptions;
        if($scope.showGenresOptions){
          $("#editGenresLink").html("Hide");
        }else{
          $("#editGenresLink").html("Edit");
        }
    };

    $scope.addAgentRowData = function(){
      var objectForamtted = {};
      console.log($scope.addAgentRow);
      var isNewRow = 0;
      var nameArray = {};
      if($scope.addAgentRow.type=="0" || angular.isUndefined($scope.addAgentRow.type)){
        $scope.addAgentRow.type = 5;
      }
      if($scope.addAgentRow.name=="" || angular.isUndefined($scope.addAgentRow.name)){
        nameArray.name = 'NA';
      }
      if(angular.isUndefined($scope.addAgentRow.companyNameId) || $scope.addAgentRow.companyNameId==null){
          alert("Please select company name.");
          return false;
        }
        else if($scope.addAgentRow.companyNameId==472 && nameArray.name=='NA'){
            alert("Please select either Company name or Agent name.");
            return false;
        }
        
        if($scope.addAgentRow.type!==5){
          nameArray = JSON.parse($scope.addAgentRow.name);
        }
        if(angular.isUndefined(nameArray.asdid) || angular.isUndefined(nameArray.atypeid)){
            objectForamtted['agentNameid'] = nameArray.name;
            objectForamtted['agentTypeid'] = $scope.addAgentRow.type;
            isNewRow = 1;
        }else{
            objectForamtted['agentNameid'] = nameArray.asdid;
            objectForamtted['agentTypeid'] = nameArray.atypeid;
        }
        var isNewCmp = (($scope.addAgentRow.companyNameId).toString()).indexOf("#");
        if(isNewCmp!=-1){
          var cmnyArray = $scope.addAgentRow.companyNameId.split('#');
          objectForamtted['cmpnyId'] = cmnyArray[0];
          isNewRow = 1;
        }else{
          objectForamtted['cmpnyId'] = $scope.addAgentRow.companyNameId;
        }

        if($scope.addAgentRow.Email==null || angular.isUndefined($scope.addAgentRow.Email) || $scope.addAgentRow.Email ==""){
          objectForamtted['agentEmail'] = null;
        }else{
          if(validateEmail($scope.addAgentRow.Email)){
              objectForamtted['agentEmail'] = $scope.addAgentRow.Email;
            }else{
              alert("Please enter valid email Id.");
              return false;
            }
        }
        if($scope.addAgentRow.Phone==null || angular.isUndefined($scope.addAgentRow.Phone) || $scope.addAgentRow.Phone ==""){
          objectForamtted['agentPhone'] = null;
        }else{
          var PhoneNumber = $scope.addAgentRow.Phone.replace(/[\s()-]+/gi, '');
          if(PhoneNumber.length!==10 || isNaN(PhoneNumber)){
            alert("Please enter valid phone number.");
            return false;
          }
          objectForamtted['agentPhone'] = $scope.addAgentRow.Phone; 
        }
        if(angular.isUndefined($scope.addAgentRow.type)){
            objectForamtted['agentTypeIDVal']  = null;
        }else if(angular.isDefined($scope.addAgentRow.type)){
          if($scope.addAgentRow.type ==="0"){
            objectForamtted['agentTypeIDVal'] = null;
          }else{
              objectForamtted['agentTypeIDVal'] = $scope.addAgentRow.type;
          }
        }
        
      objectForamtted['talentId'] = $scope.activeElement.id;
      talentFactory.addAgentDetails(isNewRow,objectForamtted,function(result) {
              console.log(result.status);
              if(result.status=="error"){
                alert(result.text);
                 return false;
              }else{
                addFetchAssociateName();
                $scope.addAgentRow = {};
                $scope.agentNameByType.length=0;
                $scope.isCmpnyDisabled = true;
                $scope.isNameDisabled = true;
                alert(result.text);
                return false;
              }
        });
    };

    $scope.submitManagement = function(){
    	var dataList = [];
    	if($('#agent').val() && $('#agent').val() !==""){
    		dataList['talent_id'] = $scope.activeElement.id;
    		dataList['associte_types_id'] = 1;
            dataList['associate_id'] = $('#agent').val();
            contactFactory.addGetAssociateNamesById(dataList,function(result) {
            	$scope.successmsg = true;
            });
    	}
    	
    	if($('#manager').val() && $('#manager').val() !==""){
    		dataList['talent_id'] = $scope.activeElement.id;
    		dataList['associte_types_id'] = 2;
            dataList['associate_id'] = $('#manager').val();
            contactFactory.addGetAssociateNamesById(dataList,function(result) {
            	$scope.successmsg = true;
            });
    	}
    	
    	if($('#attorney').val() && $('#attorney').val() !==""){
    		dataList['talent_id'] = $scope.activeElement.id;
    		dataList['associte_types_id'] = 3	;
            dataList['associate_id'] = $('#attorney').val();
            contactFactory.addGetAssociateNamesById(dataList,function(result) {
            	$scope.successmsg = true;
            });
    	}
    	
    	if($('#publicist').val() && $('#publicist').val() !==""){
    		dataList['talent_id'] = $scope.activeElement.id;
    		dataList['associte_types_id'] = 4;
            dataList['associate_id'] = $('#publicist').val();
            contactFactory.addGetAssociateNamesById(dataList,function(result) {
            	$scope.successmsg = true;
            });
    	}
        
    }

    $scope.submitAssociate = function(){
     var getAssociateInfo = JSON.parse($scope.activeElement.associate_obj);
      addFetchAssociateName();
    };
    
    // storage for all data points that are added or pulled from database
    $scope.data = {
      Contact: contactFactory.getAssociateNames(function(result) {
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
      })
      // Talent: talentFactory.getNames(function(result) {
      //   $scope.data.Talent = result;
      //   // Set talent data to active data when page loads
      //   $scope.activeData = $scope.data.Talent;
      // })
    };

    $scope.getTalentNames = function(val){
      var talentNames = [];
      return talentFactory.getNames(val, angular.noop).then(function(result){
          return result.data;
        });
    };

    

    $scope.getCreditDetails = function (itemval) {
        $scope.editElement = itemval;
        activeElementSetter['Credit']();
        $scope.btnTxt = "Update";
      };

    setTimeout(function() {
      //console.log($scope.data);
    }, 2000);

      $scope.getTalentDetails = function (itemval) {
        $scope.editElement = itemval;
        activeElementSetter['Talent']();
        $scope.btnTxt = "Update";
      };

      
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
          if ($(this).attr('validate') && $(this).attr('validate') === 'email' && $(this).val() !=='' && $(this).val() !=='null') {
        	  var re = /\S+@\S+\.\S+/;
              if (re.test($(this).val()) === false) {
                result = false;
              }
            }
          	if ($(this).attr('validate') && $(this).attr('validate') === 'phone' && $(this).val() !=='' && $(this).val() !=='null') {
        	  var re = /^\d{10}$/;
              if (re.test($(this).val()) === false) {
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
          if ($(this).attr('validate') && $(this).attr('validate') === 'email' && $(this).val() !=='' && $(this).val() !=='null') {
        	  var re = /\S+@\S+\.\S+/;
              if (re.test($(this).val()) === false) {
                result = false;
              }
            }
          	if ($(this).attr('validate') && $(this).attr('validate') === 'phone' && $(this).val() !=='' && $(this).val() !=='null') {
        	  var re = /^\d{10}$/;
              if (re.test($(this).val()) === false) {
                result = false;
              }
            }
          	if ($(this).attr('validate') && $(this).attr('validate') === 'twitter' && $(this).val() !=='' && $(this).val() !=='null') {
          	  var re = /^(https?|http?|www?|twitter.com?|twitter)/;
                if (re.test($(this).val()) === true) {
                  result = false;
                }
            }
          	if ($(this).attr('validate') && $(this).attr('validate') === 'facebook' && $(this).val() !=='' && $(this).val() !=='null') {
        	  var re = /^(https?|http?|www?|facebook.com?|facebook)/;
              if (re.test($(this).val()) === true) {
                result = false;
              }
            }
          	if ($(this).attr('validate') && $(this).attr('validate') === 'youtube' && $(this).val() !=='' && $(this).val() !=='null') {
          	  var re = /^(https?|http?|www?|youtube.com?|youtube)/;
                if (re.test($(this).val()) === true) {
                  result = false;
                }
              }
          	if ($(this).attr('validate') && $(this).attr('validate') === 'vine' && $(this).val() !=='' && $(this).val() !=='null') {
          	  var re = /^(https?|http?|www?|vine.co?|vine)/;
                if (re.test($(this).val()) === true) {
                  result = false;
                }
              }
          	if ($(this).attr('validate') && $(this).attr('validate') === 'instagram' && $(this).val() !=='' && $(this).val() !=='null') {
          	  var re = /^(https?|http?|www?|instagram.com?|instagram)/;
                if (re.test($(this).val()) === true) {
                  result = false;
                }
              }
        });
      }
      
      return result;
    };

    $scope.submitCreditdataPopData = function() {
      dataSubmitter['CreditPopUpEntry']();
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
          $scope.activeElement.comments.unshift(result);
          //Once comment is added, append it to the comments-container and clear the textarea
          $('.data-entry-comment-input').val('');
        });
      }
    };
   



    // Remove comment when delete button is clicked
    $scope.removeComment = function($event, comment_id) {
    var r = confirm("Do you really want to delete this comment?");
		if (r == true) {
			$($event.target).parent().slideUp();
		  commentFactory.removeComment(comment_id);
		} else {
		    //return false;
		}
    };

    $("#phoneNumberId").mask("(999)999-9999");
$("#phoneNumberId").on("blur", function() {
    var last = $(this).val().substr( $(this).val().indexOf("-") + 1 );
    
    if( last.length == 3 ) {
        var move = $(this).val().substr( $(this).val().indexOf("-") - 1, 1 );
        var lastfour = move + last;
        
        var first = $(this).val().substr( 0, 9 );
        
        $(this).val( first + '-' + lastfour );
    }
  });
  });
})();