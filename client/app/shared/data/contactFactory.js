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
      },
      getAssociateNames: function(callback) {
        return $http({
          method: 'GET',
          url: 'api/contact/all/getAssociateNames'
        }).then(function(res) {
          callback(res.data);
        });
      },
      getContact: function(id, callback) {
        return $http({
          method: 'GET',
          url: 'api/contact/contact',
          params: {
            id: id
          }
        }).then(function(res) {
          callback(res.data);
        });
      },

      addGetAssociateNamesById: function(dataList, callback) {
        return $http({
          method: 'POST',
          url: 'api/contact/all/addGetAssociateNamesById',
          data: {
            talent_id: dataList['talent_id'],
            associte_types_id: dataList['associte_types_id'],
            associate_id: dataList['associate_id']
          }
        }).then(function(res) {
          callback(res.data);
        });
      },
      addOrEdit: function(contactData, callback) {
        return $http({
          method: 'POST',
          url: 'api/contact/add-edit',
          data: contactData
        }).then(function(res) {
          callback(res.data);
        })
      },
      deleteContact: function(contactId, callback) {
        return $http({
          method: 'DELETE',
          url: 'api/contact/delete',
          params: {
            id: contactId
          }
        }).then(function() {
          callback();
        });
      }
     };
  });
})();