(function() {
  'use strict';
  angular.module('contactFactory', [])
  .factory('contactFactory', function($http, $state) {
    return {
      getNames: function(callback) {
        return $http({
          method: 'GET',
          url: 'api/contact/all/names'
        }).then(function(res) {
          callback(res.data);
        });
      }
     };
  });
})();