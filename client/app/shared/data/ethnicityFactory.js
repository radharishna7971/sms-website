(function() {
  'use strict';
  angular.module('ethnicityFactory', [])
  .factory('ethnicityFactory', function($http, $state) {
    return {
      getNames: function(callback) {
        return $http({
          method: 'GET',
          url: 'api/ethnicity/all/names'
        }).then(function(res) {
          callback(res.data);
        });
      },
      addOrEdit: function(ethnicityData, callback) {
        return $http({
          method: 'POST',
          url: 'api/ethnicity/add-edit',
          data: ethnicityData
        }).then(function(res) {
          callback(res.data);
        });
      },
      deleteEthnicity: function(ethnicityId, callback) {
        return $http({
          method: 'DELETE',
          url: 'api/ethnicity/delete',
          params: {
            id: ethnicityId
          }
        }).then(function() {
          callback();
        });
      }
    };
  });
})();