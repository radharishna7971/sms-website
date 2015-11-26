(function() {
  'use strict';
  angular.module('fileImportGrid', [])
  .factory('fileImportGrid', function(uiGridConstants) {
       var getGridOptions = function(){
              var importGridInfo={
                  enableRowSelection: true,
                  enableSelectAll: false,
                  enableFiltering: false,
                  enableSorting: true,
                  selectionColumn: true
              };
              importGridInfo.columnDefs = [
                { name: 'Name', displayName: 'Name'},
                { name: 'ExpandedProjects', displayName: 'Expanded Projects'},
                { name: 'Representatives', displayName: 'Representatives'},
                { name: 'Comments', displayName: 'Comments'},
                { name: 'Notes', displayName: 'Notes'}
              ];
              return importGridInfo;
            };

        return {
            getGridOptions: getGridOptions
          };
  });
})();