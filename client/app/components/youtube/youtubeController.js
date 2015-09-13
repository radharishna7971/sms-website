(function() {
  'use strict';
  angular.module('youtubeController', ['youtubeFactory'])
  .controller('youtubeController', function($scope, youtubeFactory) {

    $scope.findChannel = function($event) {
      // $($event).preventDefault();

      if ($scope.channel) {
        console.log("A");
        youtubeFactory.findChannelByName($scope.channel, function(data) {
          console.log(data);
          $scope.results = data;
        });
      }
    };
   
  });
})();

//  Top videos for a channel
// http://api.channelmeter.com/v3/youtube/videos?channel=MsgXPD3wzzt8RxHJmXH7hQ&limit=5&source=channelmeter&key=6v6gbion6t0wdxnawfquyt65i7b38hxl

// Channel identier
// api.channelmeter.com/v3/youtube/channels/:channelIdentifier