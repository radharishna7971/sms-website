(function() {
  'use strict';
  angular.module('creditTypeFactory', [])
  .factory('creditTypeFactory', function($http, $state) {
    return {
      getNames: function(callback) {
        return $http({
          method: 'GET',
          url: 'api/credit_type/all/names'
        }).then(function(res) {
          callback(res.data);
        });
      },
      addOrEdit: function(creditTypeData, callback) {
        return $http({
          method: 'POST',
          url: 'api/credit_type/add-edit',
          data: creditTypeData
        }).then(function(res) {
          callback(res.data);
        });
      },
      deleteCreditType: function(creditTypeId, callback) {
        return $http({
          method: 'DELETE',
          url: 'api/credit_type/delete',
          params: {
            id: creditTypeId
          }
        }).then(function() {
          callback();
        });
      }
    };
  });
})();