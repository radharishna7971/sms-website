(function() {
  'use strict';
  angular.module('roleFactory', [])
  .factory('roleFactory', function($http, $state) {
    return {
      getNames: function(callback) {
        return $http({
          method: 'GET',
          url: 'api/role/all/names'
        }).then(function(res) {
          callback(res.data);
        });
      },
      addOrEdit: function(roleData, callback) {
        return $http({
          method: 'POST',
          url: 'api/role/add-edit',
          data: roleData
        }).then(function(res) {
          callback(res.data);
        });
      },
      deleteRole: function(roleId, callback) {
        return $http({
          method: 'DELETE',
          url: 'api/role/delete',
          params: {
            id: roleId
          }
        }).then(function() {
          callback();
        });
      }
    };
  });
})();