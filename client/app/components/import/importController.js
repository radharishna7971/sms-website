(function() {
  'use strict';
  angular.module('importController', ['authFactory'])
  .controller('importController', function($scope, authFactory, fileImportGrid,excelReaderFileFactory) {
         
        $scope.xlsFileUpload  = {};
        $scope.showPreview = false;
        $scope.showJSONPreview = true;
        $scope.json_string = "";
        

      $scope.fileChanged = function(files) {
        $scope.sheets = [];
        $scope.excelFile = files[0];
        excelReaderFileFactory.readFile($scope.excelFile, $scope.showPreview, $scope.showJSONPreview).then(function(xlsxData) {
            $scope.sheets = xlsxData.sheets;
            objectParsing($scope.sheets);
            //console.log($scope.sheets["Female Directors  Past 5 Years"]);
        });

    };

     var objectParsing = function(dataObject){
                 var newImportarray = [];
                 angular.forEach(dataObject["Female Directors  Past 5 Years"],function(items){
                      var parseObj = {};
                      parseObj.Name=angular.isUndefined(items.Name)==true?"":items.Name;
                      parseObj.ExpandedProjects=angular.isUndefined(items["Expanded Projects"])==true?"":items["Expanded Projects"];
                      parseObj.Comments=angular.isUndefined(items.Comments)==true?"":items.Comments;
                      parseObj.Representatives=angular.isUndefined(items.Representatives)==true?"":items.Representatives;
                      parseObj.Notes=angular.isUndefined(items.Notes)==true?"":items.Notes;
                      newImportarray.push(parseObj);
                 });
                $scope.xlsFileUpload = fileImportGrid.getGridOptions();
                $scope.xlsFileUpload.data = newImportarray;
          };

          $scope.saveGirdData = function(){
            authFactory.addXlsRecords($scope.xlsFileUpload.data, function(error, user) {
                if (!error) {
                    console.log(user);
                  $scope.errorText = "";
                } else {
                  $scope.errorText = error;
                }
          });
              //console.log($scope.xlsFileUpload.data);
          };

  });
})();