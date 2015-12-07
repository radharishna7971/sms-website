(function() {
  'use strict';
  angular.module('talentGridFactory', [])
  .factory('talentGridFactory', function(uiGridConstants) {
       var getGridOptions = function(scope){
              var talentGridInfo={
                  enableRowSelection: true,
                  enableRowHeaderSelection: false,
                  multiSelect :false,
                  modifierKeysToMultiSelect:false,
                  noUnselect:false,
                  enableFiltering:true,
                  paginationPageSizes: [100, 150, 200],
                  paginationPageSize: 100,           
                  columnDefs : [
                    { field: 'id', displayName: 'id', type: 'number', visible: false},
                    { field: 'name', displayName: 'Name', enableColumnResizing: false},
                    { field: 'age', displayName: 'Age', width : '7%', type: 'number', enableColumnResizing: false},
                    { field: 'gender', width : '7%', enableColumnResizing: false,
                       type: uiGridConstants.filter.SELECT, 
                       selectOptions: [ {value: true, label: 'true'}, {value: false, label: 'false'} ]
                    },
                    { field: 'roles', displayName: 'Roles'},
                    { field: 'genres', displayName: 'Genres'},
                    { field: 'country', displayName: 'Country', enableColumnResizing: false}
                ],
                enableGridMenu: true,
                enableSelectAll: true,
                exporterCsvFilename: 'talentData.csv',
                exporterPdfDefaultStyle: {fontSize: 9},
                exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
                exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
                exporterPdfHeader: { text: "Talent Records", style: 'headerStyle' },
                exporterPdfFooter: function ( currentPage, pageCount ) {
                  return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
                },
                exporterPdfCustomFormatter: function ( docDefinition ) {
                    docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                    docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
                    return docDefinition;
                },
                exporterPdfOrientation: 'portrait',
                exporterPdfPageSize: 'LETTER',
                exporterPdfMaxGridWidth: 500,
                exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location"))
              };
              return talentGridInfo;
            };

        return {
            getGridOptions: getGridOptions
          };
  }).filter('mapGender', function() {
  var genderHash = {
    'male': 'male',
    'female': 'female'
  };
 
  return function(input) {
    if (!input){
      return '';
    } else {
      return genderHash[input];
    }
  };
});
})();