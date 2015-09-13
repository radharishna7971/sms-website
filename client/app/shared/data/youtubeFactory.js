(function() {
  'use strict';
  angular.module('youtubeFactory', [])
  .factory('youtubeFactory', function($http, $state) {

    return {
      findChannelByName: function(channelName, callback) {
        return $http({
          method: 'GET',
          url: 'http://api.channelmeter.com/v3/youtube/channels/' + channelName.replace(' ', ''),
        }).then(function(res) {
          callback(res.data);
        });
      }
    };
  });
})();