(function() {
  'use strict';
  angular.module('excelReaderFileFactory', [])
  .factory('excelReaderFileFactory', function($q, $rootScope) {
    var service = function(data) {
            angular.extend(this, data);
        }

        service.readFile = function(file, readCells, toJSON) {
            var deferred = $q.defer();

            XLSXReader(file, readCells, toJSON, function(data) {
                $rootScope.$apply(function() {
                    deferred.resolve(data);
                });
            });

            return deferred.promise;
        }


        return service;

  });
})();