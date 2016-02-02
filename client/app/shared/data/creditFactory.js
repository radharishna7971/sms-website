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
      
      getCreditsNames: function(Chars,callback) {
        return $http({
          method: 'GET',
          url: 'api/credit/all/namesByChars',
          params: {
            'Chars': Chars
          }
        });
      },
      
      getAllNames: function(callback) {
        return $http({
          method: 'GET',
          url: 'api/credit/all/names'
        });
      },

      getCredit: function(id, callback) {
        return $http({
          method: 'GET',
          url: 'api/credit/credit',
          params: {
            id: id
          }
        }).then(function(res) {
          callback(res.data);
        });
      },
      addOrEdit: function(creditData,creditGenre, callback) {
        return $http({
          method: 'POST',
          url: 'api/credit/add-edit',
          data: {
            creditData:creditData,
            creditGenre:creditGenre
          }
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