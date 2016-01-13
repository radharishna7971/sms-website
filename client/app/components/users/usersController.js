(function() {
  'use strict';
  angular.module('usersController', ['authFactory'])
  .controller('usersController', function($scope, authFactory) {
    var getUserList = function(){
      authFactory.getUsers(function(users) {
      $scope.users = users;
    });
    };
    getUserList();
    $scope.xlsFileUpload = {};
    $scope.userData = {permission: 2};
    $scope.errorText = '';
    $scope.btnTxt = "Add";
    $scope.showCnfPwd = true;
    $scope.newtext = {};
    $scope.changePasswordPanel = false;
    $scope.editElement = false;
    
    $scope.createUser = function() {
       $scope.errorText = '';
      if (!checkInputs()) {
        $scope.errorText = "Please fill in all fields and in correct format";
      }
      else if($scope.btnTxt == "Add"){
        if ( $scope.userData.password !== $scope.userData.confirmPassword) {
          $scope.errorText = "Please make sure passwords match";
        } else if ($scope.userData.password.length < 7) {
          $scope.errorText = "Password must be at least seven characters long";
        } 
      }else if($scope.btnTxt == "Update"){
        if($scope.changePasswordPanel){
          if ( $scope.newtext.newPassword !== $scope.newtext.confirmNewPassword) {
                $scope.errorText = "Please make sure new passwords match";
          } else if ($scope.newtext.newPassword.length < 7) {
                $scope.errorText = "Password must be at least seven characters long";
          } 
        }else{
            $scope.newtext.newPassword = "";
        }
      }
    if($scope.errorText == '') {
        if($scope.btnTxt == "Add"){
          authFactory.createUser($scope.userData, function(error, user) {
            if (!error) {
              $scope.users.push(user);
              $scope.userData = {permission: 2};
              delete $scope.userData.confirmPassword;
              $scope.errorText = "";
            } else {
              $scope.errorText = error;
            }
          });
        }else{
            $scope.userData.resetPassword = $scope.newtext.newPassword;
            authFactory.updateUser($scope.userData, function(error, user) {
            if (!error) {
              $scope.users.push(user);
              $scope.userData = {permission: 2};
              delete $scope.userData.confirmPassword;
              $scope.errorText = "";
              getUserList();
              resetForm();
            } else {
              $scope.errorText = error;
              //getUserList();
            }
          });

        }
      }
    };
    $scope.changePasswordLink = function(){
      $scope.newtext = {};
      $scope.changePasswordPanel = true;

    };
    $scope.cancelNewPassword = function(){
      $scope.newtext = {}; 
      $scope.changePasswordPanel = false;
    };

    $scope.clearForm = function() {
      resetForm();
    };
    
    var resetForm = function(){
      $scope.userData = {};
      $scope.editElement = false;
      $scope.showCnfPwd = true;
      $scope.changePasswordPanel = false;
      //$scope.confirmPassword = "";
      $scope.btnTxt = "Add";
    };
    //get user details by user ID
    $scope.updateUserDetails = function($event, element, userID){

      if ($($event.target).hasClass('active-element')) {
        $scope.btnTxt = "Add"; 
        $scope.showCnfPwd = true;
      } 
      // otherwise, remove active from other element in case another element is active and set form data
      else {
        $('.active-element').removeClass('active-element');
        authFactory.getUserDetails(userID,function(users) {
           $scope.userData.first_name = users[0]['first_name'];
          $scope.userData.last_name = users[0]['last_name'];
          $scope.userData.password = users[0]['password'];
          //$scope.confirmPassword = users[0]['password'];
          $scope.userData.email = users[0]['email'];
          $scope.userData.permission = users[0]['permission'];
          $scope.userData.id = users[0]['id'];
          $scope.showCnfPwd = false;
        });
        $scope.btnTxt = "Update";
        $scope.editElement = true;
      }

        
        //console.log(userID);
    };
    // Ensures all required inputs have data
    // Takes in an optional section.  If section is passed in, it means it is part of the talent form.  This is done to handle that fact that some required inputs might be hidden
    var checkInputs = function() {
      var result = true;
      $('input,select').each(function() {
        if ($(this).attr('required')) {
          if ($(this).val() === null || $(this).val().length === 0) {
            result = false;
          }
        }
        if ($(this).attr('validate') && $(this).attr('validate') === 'email' && $(this).val() !== '' && $(this).val() !=='null') {
      	  var re = /\S+@\S+\.\S+/;
            if (re.test($(this).val()) === false) {
              result = false;
            }
         }
      });

      return result;
    };
  });
})();