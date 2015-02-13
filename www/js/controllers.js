angular.module('starter.controllers', ['restangular','uiGmapgoogle-maps'])

.controller('PlanCtrl', function($scope, $stateParams,$location,PlanService) {
  $scope.search={};
  $scope.searchLocation = function(search){
    PlanService.setSearchData(search);
    $location.path("/tab/plan/plan-detail");
  };

})

.controller('PlanDetailCtrl', function($scope,PlanService,WeatherService,PlacesService, $timeout) {
  data = JSON.parse(PlanService.getSearchData());
  $scope.lat = data.location.geometry.location.k;
  $scope.long = data.location.geometry.location.D;
  $scope.current = {};
  $scope.forecast = {};
  $scope.dailyForecast = {};
  $scope.nearByLocationsList = {};
  $scope.map = { center: { latitude: $scope.lat, longitude: $scope.long  }, zoom: 9 };
  $scope.options = {scrollwheel: false};
  $scope.markers=[];

   WeatherService.getWeatherByLatnLong($scope.lat,$scope.long).then(function(weatherData){
    $scope.current = weatherData;
   });
  
  WeatherService.getForecastByLatnLong($scope.lat,$scope.long).then(function(weatherData){
    $scope.forecast = weatherData;
   });
  
  WeatherService.getDailyForecastByLatnLong($scope.lat,$scope.long).then(function(weatherData){
    $scope.dailyForecast = weatherData;
   });
  
  PlacesService.getNearByLatnLong($scope.lat,$scope.long).then(function(locationsData){
     $scope.nearByLocationsList = locationsData.results;
    var createMarkers = function(i,loc,idKey){
      var ret = {
        id:loc.id,
        latitude: loc.geometry.location.lat,
        longitude: loc.geometry.location.lng,
        title: loc.name,
        icon:loc.icon
      };
      ret[idKey] = i;
      return ret;
    }
    $scope.$watch('nearByLocationsList',function(nearByLocationsList){
      for(i=0;i<nearByLocationsList.length;i++){
        $scope.markers.push(createMarkers(i,nearByLocationsList[i]));
      }
    });
   });
})

.controller('TripsCtrl', function($scope, PlanService,PlacesService, $timeout) {
  $scope.restaurants = {};
  $scope.getHotels = function(){
    data = JSON.parse(PlanService.getSearchData());
    if(data !== null && data !== 'undefined'){
      $scope.showplacesinput = false;
      $scope.lat = data.location.geometry.location.k;
      $scope.long = data.location.geometry.location.D;

      PlacesService.getFoodByLatnLong($scope.lat,$scope.long).then(function(locationsData){
         $scope.restaurants = locationsData.results;
        console.log( $scope.restaurants);
      });
    }else{
       $scope.showplacesinput = true;
    }
  };
  
  
  $scope.changeLocation = function(loc){
    PlanService.setSearchData(search);
    $scope.getHotels();
  }
  $scope.getHotels();
})

.controller('TripDetailCtrl', function($scope, $stateParams, PlacesService) {
  $scope.hotel={};
  console.log($stateParams.tripId);
  PlacesService.getHotelDetails($stateParams.tripId).then(function(hotelData){
    $scope.hotel = hotelData.result;
    console.log($scope.hotel);
  });
  
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
