(function() {
  'use strict';
  angular.module('commentFactory', [])
  .factory('commentFactory', function($http, $state) {
    return {
      addComment: function(text, talent_id, callback) {
        return $http({
          method: 'POST',
          url: 'api/comment/add',
          data: {
            text: text,
            user_id: window.localStorage.smstudiosJwtToken,
            talent_id: talent_id
          }
        }).then(function(res) {
          callback(res.data);
        });
      }
     };
  });
})();