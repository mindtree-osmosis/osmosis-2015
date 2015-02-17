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
  var data; 
  $scope.getHotels = function(){
    data = PlanService.getSearchData();
    if(typeof(data) === "undefined"){
      data = null;
    }else{
      data = JSON.parse(data);
    }
    if(data !== null){    
      $scope.showplacesinput = false;
      $scope.lat = data.location.geometry.location.k;
      $scope.long = data.location.geometry.location.D;

      PlacesService.getFoodByLatnLong($scope.lat,$scope.long).then(function(locationsData){
         $scope.restaurants = locationsData.results;
        console.log( $scope.restaurants);
      });
    }else{
      console.log("in else part")
       $scope.showplacesinput = true;
    }
  };
  
  
  $scope.changeLocation = function(loc){
    var dat = {"location":loc};
    console.log(dat);
    PlanService.setSearchData(dat);
    $scope.getHotels();
  }
  $scope.getHotels();
})

.controller('TripDetailCtrl', function($scope, $stateParams, PlacesService,$timeout) {
  $scope.hotel={};
  $scope.photo_references = {};
  $scope.photoupdates = [];
  $scope.photos = [];
  
  
  PlacesService.getHotelDetails($stateParams.tripId).then(function(hotelData){
    $scope.hotel = hotelData.result;
    $scope.photo_references = hotelData.result.photos;
    console.log($scope.hotel);
//     angular.forEach($scope.photo_references, function(value, key) {
//       var pic= $scope.photo_references.getUrl({'maxWidth': 100, 'maxHeight': 100});
//       console.log(pic)
//       PlacesService.getHotelPhotos(value.photo_reference).then(function(photo){
//         $scope.photoupdates.push(photo);
//       })
//     });
  });
  
//   $scope.$watch('photoupdates',function(photos){
//     $timeout(function () {
//       $scope.photos = $scope.photoupdates;
//       //console.log($scope.photos);
//     },500);
//   });
  
  
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
