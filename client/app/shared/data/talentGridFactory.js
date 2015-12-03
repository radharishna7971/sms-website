(function() {
  'use strict';
  angular.module('talentGridFactory', [])
  .factory('talentGridFactory', function(uiGridConstants) {
       var getGridOptions = function(){
              var talentGridInfo={
                  enableRowSelection: true,
                  enableSelectAll: false,
                  enableFiltering: true,
                  enableSorting: true,
                  paginationPageSizes: [100, 150, 200],
                  paginationPageSize: 100,           
                  columnDefs : [
                    { field: 'id', displayName: 'id', type: 'number', visible: false},
                    { field: 'name', displayName: 'Name'},
                    { field: 'age', displayName: 'Age', type: 'number'},
                    { field: 'gender', displayName: 'Gender',
                      term: '1',
                      type: uiGridConstants.filter.SELECT,
                      selectOptions: [ { value: '1', label: 'male' }, { value: '2', label: 'female' } ],
                      cellFilter: 'mapGender'
                    },
                    { field: 'roles', displayName: 'Roles'},
                    { field: 'genres', displayName: 'Genres'},
                    { field: 'city', displayName: 'City'},
                    { field: 'state', displayName: 'State'},
                    { field: 'country', displayName: 'Country'}
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
    1: 'male',
    2: 'female'
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