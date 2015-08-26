(function() {
  'use strict';
  angular.module('talentFactory', [])
  .factory('talentFactory', function($http, $state) {
    return {
      getAll: function(callback) {
        return $http({
          method: 'POST',
          url: 'api/talent/all'
        }).then(function(res) {
            callback(res.data);
        });
      }
     };
  });
})();