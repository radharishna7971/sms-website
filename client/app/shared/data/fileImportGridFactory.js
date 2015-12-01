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
                { name: 'RecordID', displayName: 'RecordID', enableCellEdit: false},
                { name: 'Name', displayName: 'Name'},
                { name: 'Actor', displayName: 'Actor'},
                { name: 'Director', displayName: 'Director'},
                { name: 'Producer', displayName: 'Producer'},
                { name: 'ExecutiveProducer', displayName: 'ExecutiveProducer'},
                { name: 'Writer', displayName: 'Writer'},
                { name: 'Genre', displayName: 'Genre'},
                { name: 'Keywords', displayName: 'Keywords'},
                { name: 'Screenplay', displayName: 'Screenplay'},
                { name: 'USBoxOfficeCume', displayName: 'USBoxOfficeCume'},
                { name: 'MostRecentAwards', displayName: 'MostRecentAwards'},
                { name: 'USRelease', displayName: 'USRelease'},
                { name: 'Logline', displayName: 'Logline'}
              ];
              return importGridInfo;
            };

        return {
            getGridOptions: getGridOptions
          };
  });
})();