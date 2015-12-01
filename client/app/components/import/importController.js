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
        });

    };

     var objectParsing = function(dataObject){
                  //console.log(dataObject["Films (Last 10 years)"]);
                  var i = 0;
                 var newImportarray = [];
                 angular.forEach(dataObject["Films  (Last 10 years)"],function(items){
                       var parseObj = {};
                       parseObj.RecordID=angular.isUndefined(items["Record ID"])==true?"":items["Record ID"];
                       parseObj.Name=angular.isUndefined(items["Name"])==true?"":items["Name"];
                       parseObj.Actor=angular.isUndefined(items["Actor"])==true?"":items["Actor"];
                       parseObj.Director=angular.isUndefined(items["Director"])==true?"":items["Director"];
                       parseObj.Producer=angular.isUndefined(items["Producer"])==true?"":items["Producer"];
                       parseObj.ExecutiveProducer=angular.isUndefined(items["Executive Producer"])==true?"":items["Executive Producer"];
                       parseObj.Writer=angular.isUndefined(items["Writer"])==true?"":items["Writer"];
                       parseObj.Genre=angular.isUndefined(items["Genre"])==true?"":items["Genre"];
                       parseObj.Keywords=angular.isUndefined(items["Keywords"])==true?"":items["Keywords"];
                       parseObj.Screenplay=angular.isUndefined(items["Screenplay"])==true?"":items["Screenplay"];
                       parseObj.USBoxOfficeCume=angular.isUndefined(items["US Box Office Cume"])==true?"":items["US Box Office Cume"];
                       parseObj.MostRecentAwards=angular.isUndefined(items["10 Most Recent Awards"])==true?"":items["10 Most Recent Awards"];
                       parseObj.USRelease=angular.isUndefined(items["US Release"])==true?"":items["US Release"];
                       parseObj.Logline=angular.isUndefined(items["Logline"])==true?"":items["Logline"];
                       if(i < 11){
                            newImportarray.push(parseObj);
                       }
                       i++;
                       
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