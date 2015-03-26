angular.module('starter.services', ['restangular'])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlin',
    lastText: 'Did you get the ice cream?',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  }
})


.factory('PlanService', function() {
  // Might use a resource here that returns a JSON array

  return {
    getSearchData: function() {
      if(localStorage.getItem("searchData")!==null){
        data = localStorage.getItem("searchData");
        return data;
      }else{
        data="no data";
      }
    },
    setSearchData: function(data){
      localStorage.setItem("searchData",JSON.stringify(data));
    }
  }
})

.factory('CurrencyConverterService', function($http) {
	// Might use a resource here that returns a JSON array
	return {

		getCurrentCountry: function(){
	    	var ipInfo =  $http({
	            method: "get",
	            url: 'http://ipinfo.io/?callback='
	        });

	    	return( ipInfo.then( handleSuccess, handleError ) );
		},

	    convertCurrency : function(fromToCountry){
	    	var currencyInfo = $http({
	    		method : 'get',
	    		url : 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22' +
	    					fromToCountry + '%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback='
	    	});

	    	return( currencyInfo.then( handleSuccess, handleError ) );
	    }
	}
})

.factory('WeatherService',function(Restangular,$http,$q){
    console.log('in CityList service');
    var weatherInfo;
   return{
     getForecastByLatnLong: function(lat,long) {
                weatherInfo =  $http({
                        method: "get",
                        url: "http://api.openweathermap.org/data/2.5/forecast",
                        params: {
                            lat: lat,
                            lon: long
                        }
                    });

                    return( weatherInfo.then( handleSuccess, handleError ) );
            },
     getDailyForecastByLatnLong: function(lat,long) {
                weatherInfo =  $http({
                        method: "get",
                        url: "http://api.openweathermap.org/data/2.5/forecast/daily",
                        params: {
                            lat: lat,
                            lon: long,
                          cnt: 10,
                          mode:'json'
                        }
                    });

                    return( weatherInfo.then( handleSuccess, handleError ) );
            },
        getWeatherByLatnLong: function(lat,long) {
                weatherInfo =  $http({
                        method: "get",
                        url: "http://api.openweathermap.org/data/2.5/weather",
                        params: {
                            lat: lat,
                            lon: long
                        }
                    });

                    return( weatherInfo.then( handleSuccess, handleError ) );
            },
       getWeatherByCityName: function(cityname){
         weatherInfo =  $http({
                        method: "get",
                        url: "http://api.openweathermap.org/data/2.5/weather",
                        params: {
                            q: cityname
                        }
                    });

                    return( weatherInfo.then( handleSuccess, handleError ) );
       }

    }

    })

.factory('PlacesService',function(Restangular,$http,$q){
    console.log('in Places service');
    var locationInfo;
  var types;
  var apiKey = 'AIzaSyA8m0_8rTurwIZlyvrbrWVfxeJLV1tbUQ4';
  var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
  var location;
   return{
     getNearByLatnLong: function(lat,long) {
       types ='art_gallery|museum|amusement_park|zoo|aquarium|bowling_alley|casino|park' ;
       location = lat+','+long;
                locationInfo =  $http({
                        method: "get",
                        url: url,
                        params: {
                            location: location,
                            type: types,
                          radius:'10000',
                             key: apiKey
                        }
                    });

                    return( locationInfo.then( handleSuccess, handleError ) );
            },
     getFoodByLatnLong: function(lat,long) {
       types ='food|restaurant|cafe|bar|bakery|lodging|meal_delivery|meal_takeaway|night_club' ;
        location = lat+','+long;
                locationInfo =  $http({
                        method: "get",
                       url: url,
                        params: {
                            location: location,
                            type: types,
                          radius:'10000',
                             key: apiKey
                        }
                    });

                    return( locationInfo.then( handleSuccess, handleError ) );
            },
     getHotelDetails: function(id) {
                locationInfo =  $http({
                  method: "get",
                  url: "https://maps.googleapis.com/maps/api/place/details/json",
                  params: {
                     key: apiKey,
                    placeid: id

                  }
                });
                    return( locationInfo.then( handleSuccess, handleError ) );
            },
     getHotelPhotos: function(ref) {
                locationInfo =  $http({
                  method: "get",
                  url: "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400",
                  params: {
                    photoreference: ref,
                    key: apiKey
                  }
                });
                    return( locationInfo.then( handleSuccess, handleError ) );
            }

    }

    })

  .factory('WikiService',function(Restangular,$http,$q){
        console.log('in Wiki service');
        var locationInfo;
      var types;
      var url = 'http://en.wikipedia.org/w/api.php';
      var location;
       return{
         getContext: function(section,title) {
                    locationInfo =  $http({
                            method: "get",
                            url: url,
                            params: {
                                action: 'query',
                                prop: 'revisions',
                                rvprop:'content',
                                rvsection: section, //history
                                titles: title,
                                format: 'json'
                            }
                        });

                        return( locationInfo.then( handleSuccess, handleError ) );
                }
              };
        })
        
.factory('CurrencyService', function() {
  // Might use a resource here that returns a JSON array
	var fromCountry = null;
	var toCountry = null;
	var amount = 1;
	var populateFromCurrency = true;
  return {
    getFromCountry: function() {
      return fromCountry;
    },
    setFromCountry: function(data){
    	fromCountry = data;
    },
    getToCountry: function() {
        return toCountry;
    },
    setToCountry: function(data){
    	toCountry = data;
    },
    getAmount: function() {
        return amount;
    },
    setAmount: function(amt){
    	amount = amt;
    },
    getPopulateFromCurrency: function() {
        return populateFromCurrency;
    },
    setPopulateFromCurrency : function(from){
    	populateFromCurrency = from;
    }
  }
})
/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [{
    id: 0,
    name: 'Ben Sparrow',
    notes: 'Enjoys drawing things',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    notes: 'Odd obsession with everything',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlen',
    notes: 'Wears a sweet leather Jacket. I\'m a bit jealous',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    notes: 'I think he needs to buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    notes: 'Just the nicest guy',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];


  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
});

function handleSuccess( response ) {

                    return( response.data );

                }

function handleError( response ) {


                   if (
                       ! angular.isObject( response.data ) ||
                       ! response.data.message
                       ) {

                       return( $q.reject( "An unknown error occurred." ) );

                   }

                   // Otherwise, use expected error message.
                   return( $q.reject( response.data.message ) );

               }
