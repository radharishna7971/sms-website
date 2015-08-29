(function() {
  'use strict';
  angular.module('genreFactory', [])
  .factory('genreFactory', function($http, $state) {
    return {
      getNames: function(callback) {
        return $http({
          method: 'GET',
          url: 'api/genre/all/names'
        }).then(function(res) {
          callback(res.data);
        });
      },
      addOrEdit: function(genreData, callback) {
        return $http({
          method: 'POST',
          url: 'api/genre/add-edit',
          data: genreData
        }).then(function(res) {
          callback(res.data);
        })
      }
     };
  });
})();