(function() {
  'use strict';
  angular.module('talentFactory', [])
  .factory('talentFactory', function($http, $state) {
    return {
      getAll: function(callback) {
        return $http({
          method: 'GET',
          url: 'api/talent/all'
        }).then(function(res) {
            callback(res.data);
        });
      },
      getNames: function(callback) {
        return $http({
          method: 'GET',
          url: 'api/talent/all/names'
        }).then(function(res) {
          callback(res.data);
        });
      },
      talentProfile: function(id, callback) {
        return $http({
          method: 'GET',
          url: 'api/talent/profile',
          params: {
            'talent_id': id
          }
        }).then(function(res) {
          callback(res.data);
        });
      },
      getTalent: function(id, callback) {
        return $http({
          method: 'GET',
          url: 'api/talent',
          params: {
            'id': id
          }
        }).then(function(res) {
          callback(res.data);
        });
      },
      addOrEdit: function(talentData, callback) {
        // Remove comments
        if (talentData.hasOwnProperty('comments')) {
          delete talentData.comments;
        }

        return $http({
          method: 'POST',
          url: 'api/talent/add-edit',
          data: talentData
        }).then(function(res) {
          callback(res.data);
        });
      },
      deleteTalent: function(talentId, callback) {
        return $http({
          method: 'DELETE',
          url: 'api/talent/delete',
          params: {
            id: talentId,
            user_id: window.localStorage.smstudiosId
          }
        }).then(function() {
          callback();
        });
      },
      addTalentCreditJoin: function(talentId, creditIdArray, roleId, callback) {
        return $http({
          method: 'POST',
          url: '/api/talent/talent-credit-join/add',
          data: {
            credit_ids: creditIdArray,
            talent_id: talentId, 
            role_id: roleId
          }
        }).then(function(res) {
          callback(res.data);
        });
      },
      removeTalentCreditJoin: function(joinId, callback) {
        return $http({
          method: 'DELETE',
          url: '/api/talent/talent-credit-join/delete',
          params: {
            join_id: joinId
          }
        }).then(function(res) {
          callback(res.data);
        });
      }
     };
  });
})();