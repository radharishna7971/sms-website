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
      }
     };
  });
})();