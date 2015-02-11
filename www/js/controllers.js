angular.module('starter.controllers', ['restangular','uiGmapgoogle-maps'])

.controller('PlanCtrl', function($scope, $stateParams,$location,PlanService) {
  $scope.search={};
  $scope.searchLocation = function(search){
    PlanService.setSearchData(search);
    $location.path("/tab/plan/plan-detail");
  };

})

.controller('PlanDetailCtrl', function($scope,PlanService,WeatherService) {
  data = JSON.parse(PlanService.getSearchData());
  $scope.lat = data.location.geometry.location.k;
  $scope.long = data.location.geometry.location.D;
  $scope.current = {};
  $scope.forecast = {};
  $scope.dailyForecast = {};
  $scope.map = { center: { latitude: $scope.lat, longitude: $scope.long  }, zoom: 9 };
   WeatherService.getWeatherByLatnLong($scope.lat,$scope.long).then(function(weatherData){
    $scope.current = weatherData;
   });
  WeatherService.getForecastByLatnLong($scope.lat,$scope.long).then(function(weatherData){
    $scope.forecast = weatherData;
   
   });
  WeatherService.getDailyForecastByLatnLong($scope.lat,$scope.long).then(function(weatherData){
    $scope.dailyForecast = weatherData; 
   });

})

.controller('TripsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('TripDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('InfoCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
