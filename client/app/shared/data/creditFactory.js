(function() {
  'use strict';
  angular.module('creditFactory', [])
  .factory('creditFactory', function($http, $state) {
    return {
      getNames: function(callback) {
        return $http({
          method: 'GET',
          url: 'api/credit/all/names'
        }).then(function(res) {
          callback(res.data);
        });
      },
      getCredit: function(id, callback) {
        return $http({
          method: 'GET',
          url: 'api/credit',
          params: {
            id: id
          }
        }).then(function(res) {
          callback(res.data);
        });
      },
      addOrEdit: function(creditData, callback) {
        return $http({
          method: 'POST',
          url: 'api/credit/add-edit',
          data: creditData
        }).then(function(res) {
          callback(res.data);
        });
      },
      deleteCredit: function(creditId, callback) {
        return $http({
          method: 'DELETE',
          url: 'api/credit/delete',
          params: {
            id: creditId
          }
        }).then(function() {
          callback();
        });
      }
     };
  });
})();