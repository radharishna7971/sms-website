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
                  paginationPageSizes: [25, 50, 75],
                  paginationPageSize: 25,           
                  columnDefs : [
                    { field: 'id', displayName: 'id', type: 'number', visible: false},
                    { field: 'first_name', displayName: 'First Name'},
                    { field: 'last_name', displayName: 'Last Name'},
                    { field: 'age', displayName: 'Age', type: 'number'},
                    { field: 'gender', displayName: 'Gender'},
                    { field: 'email', displayName: 'Email'},
                    { field: 'phone', displayName: 'Phone'}
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
  });
})();