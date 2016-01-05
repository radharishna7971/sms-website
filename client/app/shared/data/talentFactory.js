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
       getAllCreatedBy: function(callback) {
        return $http({
          method: 'GET',
          url: 'api/talent/allCreatedBy'
        }).then(function(res) {
            callback(res.data);
        });
      },
      getCountryNames: function(callback) {
        return $http({
          method: 'GET',
          url: 'api/talent/allCountryNames'
        }).then(function(res) {
            callback(res.data);
        });
      },
      getAwardsNames: function(callback) {
        return $http({
          method: 'GET',
          url: 'api/talent/allAwards'
        }).then(function(res) {
            callback(res.data);
        });
      },
      getNames: function(nameChars,callback) {
        return $http({
          method: 'GET',
          url: 'api/talent/all/names',
          params: {
            'nameChars': nameChars
          }
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
      updateTalentPartnerName: function(id, partnerName, callback) {
        return $http({
          method: 'GET',
          url: 'api/talent/talentPartnerName',
          params: {
            'talent_id': id,
            'partner_name':partnerName
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

      getTalentAllInfoById: function(id, callback) {
        return $http({
          method: 'GET',
          url: 'api/talent',
          params: {
            'id': id
          }
        });
      },

      addOrEdit: function(talentData, callback) {
        // Remove comments
        if (talentData.hasOwnProperty('comments')) {
          delete talentData.comments;
          delete talentData.talentCreditJoins;
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

      exportTalentDetailXls: function(talentIdArray, callback) {
        return $http({
          method: 'POST',
          url: 'http://www.socialmediastudios.co:8080/upload/talent/xlsx',
          data: {
            pay: talentIdArray.pay
          },
	responseType: 'arraybuffer'
        }).success(function(res) {
          //callback(res);
		downloadPDFfromWS(res, 'DRMExport.xlsx');
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

function downloadPDFfromWS(response, fileName){
    // IE <10
    if (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
       // hidePleaseWait();
        return;
    }
    //var name = 'ComparisonProfileReport.pdf';
    var name = fileName;
    var mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;

        navigator.saveBlob = navigator.saveBlob || navigator.msSaveBlob || navigator.mozSaveBlob || navigator.webkitSaveBlob;

        window.saveAs = window.saveAs || window.webkitSaveAs || window.mozSaveAs || window.msSaveAs;

        if (BlobBuilder && (window.saveAs || navigator.saveBlob)) {
                var builder = new BlobBuilder();
                builder.append(response);
                var blob = builder.getBlob(mimeType);

                if (window.saveAs) {
                    window.saveAs(blob, name);
                } else {
                    navigator.saveBlob(blob, name);
            }
        } else {
            var a = document.createElement('a');
            var file = new Blob([response], {type: mimeType});
            a.href = URL.createObjectURL(file);
            a.download = name;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            delete a;
        }
        console.timeEnd("pdf");

    //hidePleaseWait();
}