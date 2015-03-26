angular.module('starter.controllers', ['restangular','uiGmapgoogle-maps','ionic.rating', 'ionic.contrib.ui.cards'])

.controller('PlanCtrl', function($scope, $stateParams,$location,PlanService) {
  $scope.search={};
  $scope.searchLocation = function(search){
    PlanService.setSearchData(search);
    $location.path("/tab/plan/plan-detail");
  };
})

.controller('PlanDetailCtrl', function($scope,WikiService,PlanService,WeatherService,PlacesService,
   $timeout,$ionicModal,$ionicSlideBoxDelegate) {
  var data;
  $scope.getWeatherAndPlaces = function() {
    data = JSON.parse(PlanService.getSearchData());
    console.log(data);
  $scope.lat = data.location.geometry.location.k;
  $scope.long = data.location.geometry.location.D;
  $scope.current = {};
  $scope.forecast = {};
  $scope.dailyForecast = {};
  $scope.nearByLocationsList = {};
  $scope.cityname = data.location.formatted_address;
  $scope.title = data.location.address_components[0].long_name;
  $scope.restaurants={};
  $scope.classname='drawer-collapses';
  $scope.hideref = 'hideref';
  $scope.max=5;

  var advisoryArray = [
    {
      "type":"advisory-yellow",
      "text":"advisory-text",
      "data":"ADVISORY: Weather may change any time. Flight re-schedule expected."
    },
    {
      "type":"advisory-yellow",
      "text":"advisory-text",
      "data":"ADVISORY: Very Poor visibility foreseen. Flight cancellations expected."
    },
    {
      "type":"advisory-green",
      "text":"advisory-text",
      "data":"ADVISORY: All Good. No changes in your flight schedule."
    },
    {
      "type":"advisory-green",
      "text":"advisory-text",
      "data":"ADVISORY: Clear Weather. Have a great Trip!"
    },
    {
      "type":"advisory-red",
      "text":"advisory-text",
      "data":"ADVISORY: Rough Weather. All flights have been Cancelled."
    },
    {
      "type":"advisory-red",
      "text":"advisory-text",
      "data":"ADVISORY: Ebola Vaccination Must. Please be cautioned."
    }];

// context 2 for history,
// context 10 for transportation

  WikiService.getContext(2,$scope.title).then(function(data){
    var text = data.query.pages;
        angular.forEach(data.query.pages, function(value, key) {
          var contextdata = text[key].revisions[0];
          angular.forEach(contextdata, function(value, key) {
            if(key.length == 1){
              $scope.context = value.wiki2html().split('{{').join("<span class='hidebraces'>")
              .split('}}').join("</span>").split('<ref>').join("<span class='hidebraces'>").split('</ref>').join("</span>").split('thumb').join('');

              console.log($scope.context);
            }
          });
        });
  });

  WikiService.getContext(10).then(function(data){
    var text = data.query.pages;
        angular.forEach(data.query.pages, function(value, key) {
          var contextdata = text[key].revisions[0];
          angular.forEach(contextdata, function(value, key) {
            if(key.length == 1){
              $scope.transportation = value.wiki2html().split('{{').join("<span class='hidebraces'>")
              .split('}}').join("</span>").split('<ref>').join("<span class='hidebraces'>").split('</ref>').join("</span>");
            }
          });
        });
  });




   WeatherService.getWeatherByLatnLong($scope.lat,$scope.long).then(function(weatherData){
    $scope.current = weatherData;
    $scope.advisory = advisoryArray[Math.floor(Math.random() * advisoryArray.length)];
   });

  WeatherService.getForecastByLatnLong($scope.lat,$scope.long).then(function(weatherData){
    $scope.forecast = weatherData;
   });

  WeatherService.getDailyForecastByLatnLong($scope.lat,$scope.long).then(function(weatherData){
    $scope.dailyForecast = weatherData;
   });

  PlacesService.getNearByLatnLong($scope.lat,$scope.long).then(function(locationsData){
     $scope.nearByLocationsList = locationsData.results;
   });

   PlacesService.getFoodByLatnLong($scope.lat,$scope.long).then(function(locationsData){
      $scope.restaurants = locationsData.results;
 });

   $scope.onDragDown = function(){
     if($scope.classname=="drawer-collapses"){
       $scope.classname="drawer-expand";
     }else{
       $scope.classname="drawer-collapses";
     }
   }

   $ionicModal.fromTemplateUrl('templates/map-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
    $scope.showList = "false";
    $scope.showIcon = "ion-map";
    $ionicSlideBoxDelegate.enableSlide(false);
    $scope.map = { center: { latitude: $scope.lat, longitude: $scope.long  }, zoom: 12 };
    $scope.options = {scrollwheel: true};
    $scope.markers=[];
    $scope.groups = [];
    $scope.groups.place = {"name":"Places to see","places":$scope.nearByLocationsList};
    $scope.groups.restaurants = {"name":"Hotels & Restaurants","places":$scope.restaurants};
    console.log($scope.groups);
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
      for(i=0;i<$scope.nearByLocationsList.length;i++){
        $scope.markers.push(createMarkers(i,$scope.nearByLocationsList[i]));
      }

      for(i=0;i<$scope.restaurants.length;i++){
        $scope.markers.push(createMarkers(i,$scope.restaurants[i]));
      }

      $scope.showMapList = function (){
        if($scope.showList == 'false'){
          console.log("in if part "+ $scope.showList)
          $scope.showList = 'true';
          $ionicSlideBoxDelegate.next();
          $scope.showIcon = "ion-grid";
        }else{
          console.log("in else part "+$scope.showList)
          $scope.showList = "false";
          $ionicSlideBoxDelegate.previous();
          $scope.showIcon = "ion-map";
        }
      }

      $scope.slideHasChanged = function(index){
        $ionicSlideBoxDelegate.update();
      }


  };
  $scope.closeModal = function() {
    $ionicSlideBoxDelegate.enableSlide(true);
    $scope.modal.hide();

  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
  };

  $scope.getWeatherAndPlaces();

   $scope.doRefresh = function () {
    $scope.getWeatherAndPlaces();
    $scope.$broadcast('scroll.refreshComplete');
  };
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

  $scope.doRefresh = function () {
    $scope.getHotels();
    $scope.$broadcast('scroll.refreshComplete');
  };
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

.controller('MoreCtrl', function($scope, $location, $state) {
	$scope.goToCurrencyConverter = function(){
		$state.go('tab.currency');
	 };

	 $scope.goToTravelChecklist = function(){
		$state.go('tab.checklist');
	 };

	 $scope.goToTripEssentials = function(){
		$state.go('tab.essentials');
	 };

	 $scope.goToOffers = function(){
		$state.go('tab.offers');
	 };

	 $scope.goToSettings = function(){
		$state.go('tab.settings');
	 };
})

.controller('SettingsCtrl', function($scope, $location, $state, $ionicActionSheet, $timeout) {
	$scope.travellerList = [{
			type : "Backpackers",
			desc : ""
		},
		{
			type : "Family Vacation-ers",
			desc : ""
		},
		{
			type : "Long-term travellers",
			desc : ""
		},
		{
			type : "Groupies",
			desc : ""
		},
		{
			type : "Business Traveller",
			desc : ""
		},
		{
			type : "Adventure Junkies",
			desc : ""
		}
	];

	// Triggered on a button click, or some other target
	 $scope.show = function() {

	   // Show the action sheet
	   var hideSheet = $ionicActionSheet.show({
	     buttons: [
	       { text: 'Rate the Application' },
	       { text: 'Send Feedback' }
	     ],
	     titleText: 'Feedback and Support',
	     cancelText: 'Cancel',
	     cancel: function() {
	          // add cancel code..
	        },
	     buttonClicked: function(index) {
	       return true;
	     }
	   });

	   // For example's sake, hide the sheet after two seconds
	  /* $timeout(function() {
	     hideSheet();
	   }, 2000);*/
	 }
})

.controller('CurrencyConverterCtrl', function($scope, CurrencyConverterService, $state, $ionicLoading, CurrencyService, $filter) {
	  $scope.currency = {};
	  countries = $filter('orderBy')(countries, 'countryName');
	  $scope.currency.countries = countries;
	  $scope.currency.amount = CurrencyService.getAmount();

	  var init = function(){
		  $scope.currency.fromCurrency = CurrencyService.getFromCountry();
		  if(!$scope.currency.fromCurrency){
			  $scope.currency.fromCurrency = countries[0];
			  CurrencyService.setFromCountry(countries[0]);
		  }
		  $scope.currency.toCurrency =  CurrencyService.getToCountry();
		  if(!$scope.currency.toCurrency){
			  $ionicLoading.show({
					content: 'Loading',
					animation: 'fade-in',
					showBackdrop: true,
					maxWidth: 200,
					showDelay: 0
			  });
			  CurrencyConverterService.getCurrentCountry().then(function(ipInfo){
				  for(var i = 0; i < countries.length; i++){
					  if(ipInfo.country == countries[i].countryCode){
						  $scope.currency.toCurrency = countries[i];
						  CurrencyService.setToCountry(countries[i]);
						  $scope.convertCurrency();
						  break;
					  }
				  }
				  $ionicLoading.hide();
			  }, function(){
				  $ionicLoading.hide();
			  });
		  }else{
			  $scope.convertCurrency();
		  }
		  $scope.currency.convertedAmount = CurrencyService.getAmount();
	  }

	  $scope.convertCurrency = function(){
		  if($scope.currency.fromCurrency && $scope.currency.toCurrency){
			  $ionicLoading.show({
					content: 'Loading',
					animation: 'fade-in',
					showBackdrop: true,
					maxWidth: 200,
					showDelay: 0
			  });
			  var concatCurrencyCode = $scope.currency.fromCurrency.currencyCode + $scope.currency.toCurrency.currencyCode;
			  CurrencyConverterService.convertCurrency(concatCurrencyCode).then(function(currencyData){
				  $scope.currency.convertedAmount = ($scope.currency.amount * currencyData.query.results.rate.Rate).toFixed(4);;
				  $ionicLoading.hide();
			  }, function(){
				  $scope.currency.convertedAmount = '';
				  alert("Sorry, Couldn't get the data.");
				  $ionicLoading.hide();
			  });
		  }
	  };

	  $scope.showlist = function(isFrom){
		  CurrencyService.setPopulateFromCurrency(isFrom);
		  CurrencyService.setAmount($scope.currency.amount);
		  $state.go('tab.currencylist');
	  }

	  $scope.swap = function(){
		  var fromCurrency = $scope.currency.fromCurrency;
		  $scope.currency.fromCurrency = $scope.currency.toCurrency;
		  $scope.currency.toCurrency = fromCurrency;
		  $scope.convertCurrency();
	  };

	  init();
})

.controller('CurrencyListCtrl', function($scope, $state, CurrencyService, $sce) {
	 $scope.currency = {};
	 $scope.currency.countries = countries;

	 if(CurrencyService.getPopulateFromCurrency()){
		$scope.selectedCountry = CurrencyService.getFromCountry();
	 }else{
		 $scope.selectedCountry = CurrencyService.getToCountry();
	 }
	 //console.log("selectedCountry.currencyCode : " + $scope.selectedCountry.currencyCode);
	 $scope.onCountrySelect = function(country){
		 if(CurrencyService.getPopulateFromCurrency()){
			 CurrencyService.setFromCountry(angular.copy(country));
		 }else{
			 CurrencyService.setToCountry(angular.copy(country));
		 }
		 $state.go('tab.currency');
	 }
})

.controller('ItineraryListCtrl', function($scope, $state, $ionicSlideBoxDelegate,$ionicSwipeCardDelegate,$ionicModal,$ionicPopup, $timeout) {
	$scope.itinerary = true;
  $scope.slidestop = function(index) {
    $ionicSlideBoxDelegate.enableSlide(false);
  }

	$scope.itineraryDetails = [{
		city : "Goa",
		date : "12th June 2015"
	},
	{
		city : "Rome",
		date : "10th Aug 2015"
	}];

	$scope.wishlist = [{
		city : "Visit Goa"
	},
	{
		city : "Road trip to Ladakh"
	},
	{
		city : "Visit Pondicherry"
	},
	{
		city : "Backpack Across Europe"
	}];

	$scope.toDetailsChange = function(){
		$state.go('tab.itineraryDetails');
	};

  $scope.pageTitle = "Itinerary";
	$scope.activeSlide = 0;


	$scope.toggleWishlist = function (){
        if($scope.itinerary == true){
          console.log("$scope.itinerary " + $scope.itinerary);
          $scope.itinerary = false;
          $ionicSlideBoxDelegate.next();
          $scope.pageTitle = "Wishlist";
        }else{
          console.log("$scope.itinerary " + $scope.itinerary);
          $scope.itinerary = true;
          $ionicSlideBoxDelegate.previous();
          $scope.pageTitle = "Itinerary";
        }
    }

	$scope.addItinerary = function(){
		$state.go('tab.addItinerary');
	}

   // Triggered on a button click, or some other target
$scope.showPopup = function() {
  $scope.data = {}

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: '<input type="text" ng-model="data.wifi" placeholder="Eg., Do a hike travel..">',
    title: 'Add your wish',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.wifi) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return $scope.data.wifi;
          }
        }
      }
    ]
  });
  myPopup.then(function(res) {
    var obj = {};
    if(res.length>0){
      obj.city = res;
      $scope.wishlist.push(obj);
    }

  });
 };



})

.controller('ItineraryDetailsCtrl',function($scope,$stateParams){
  $scope.cityname = $stateParams.city;
})


.controller('TravelCheckListCtrl', function($scope) {
	$scope.checklistItems = [{
		name : "Do you need a passport?",
		isChecked : false
	},
	{
		name : "Is your passport valid?",
		isChecked : false
	},
	{
		name : "Do you need any inoculations before you go?",
		isChecked : false
	},
	{
		name : "Do you need to fill any prescriptions before you go?",
		isChecked : false
	},
	{
		name : "Do you need an adaptor for electricity?",
		isChecked : false
	},
	{
		name : "Do you have any necessary chargers?",
		isChecked : false
	},
	{
		name : "Do you know how you'll get from the airport to your hotel?",
		isChecked : false
	},
	{
		name : "Will you be sightseeing? If so, will you need a rental car?",
		isChecked : false
	},
	{
		name : "Are there any cultural or legal restrictions or taboos where you're going? For instance, many Arab countries" +
				" do not permit alcohol and some areas of certain countries may be off limits to tourists.",
		isChecked : false
	},
	{
		name : "Do you have hotel reservations? Other accommodations?",
		isChecked : false
	},
	{
		name : "Do you know who to call in case of emergency when you're away? For instance, where is the nearest Canadian consulate?" +
				" Or how can you quickly cancel credit cards or travelers cheques?",
		isChecked : false
	},
	{
		name : "Can you exchange currency where you're going or do you need it before you go?",
		isChecked : false
	},
	{
		name : "Is there a second currency you should carry (ie. U.S. dollars)?",
		isChecked : false
	},
	{
		name : "Do you need travellers cheques or will your credit cards do?",
		isChecked : false
	},
	{
		name : "Can you use your debit card?",
		isChecked : false
	},
	{
		name : "Can you use your phone card to call home?",
		isChecked : false
	},
	{
		name : "Can your cellular phone roam where you want to?",
		isChecked : false
	},
	{
		name : "Have you considered what the weather will be like? Some countries have rainy seasons. Others experience hurricanes" +
				" and flooding almost annually.",
		isChecked : false
	},
	{
		name : "Do you have insurance (medical, life, cancellation, etc.)?",
		isChecked : false
	},
	{
		name : "Do you need a first aid kit?",
		isChecked : false
	}];
})

.controller('TravelEssentialsCtrl', function($scope, $location, $state) {
	$scope.travelEssentialsList = [{
		name : "Travel Insurance",
		description : "Be secured while you travel abroad."
	},
	{
		name : "Trip Assistance Services",
		description : "Travel worry free."
	},
	{
		name : "International Sim Cards",
		description : "Stay connected always."
	},
	{
		name : "International Forex Cards",
		description : "Takes care of all your forex needs."
	}
	];
})

.controller('OffersCtrl', function($scope, $location, $state) {
	$scope.offersList = [{
		image : "bookmore.png",
		title : "Get flat Rs.750 eCash",
		desc : "Book 4 or more tickets",
		code : "TMORE",
		validity : "Dec 31, 2015"
	},
	{
		image : "reward.png",
		title : "Get tenfold rewards benefits",
		desc : "With HDFC Bank Diners Club Credit CardValidity:Mar 31, 2015",
		code : "",
		validity : "Dec 31, 2015"
	},
	{
		image : "bookmore.png",
		title : "Get flat Rs.750 eCash",
		desc : "Book 4 or more tickets",
		code : "TMORE",
		validity : "Dec 31, 2015"
	},
	{
		image : "bookmore.png",
		title : "Get flat Rs.750 eCash",
		desc : "Book 4 or more tickets",
		code : "TMORE",
		validity : "Dec 31, 2015"
	}
	];
})

.controller('CardsCtrl', function($scope, $ionicSwipeCardDelegate,$sce) {
  $scope.renderHtml = function(value) {
       return $sce.trustAsHtml(value);
   };
  var cardTypes = [{
    title: 'Where are you going?',
    html: '<input type="text" ng-model="toplace" placeholder="eg.,Place you are travelling">'

  }, {
    title: 'When you have flight?',
    html: '<input type="date" ng-model="flightdate">'

  }, {
    title: 'When is your cab?',
    html: '<input type="date" ng-model="cabdate">'

  }, {
    title: 'Where are you staying?',
    html: '<input type="text" ng-model="hotelname" placeholder="eg.,Hotel you are staying">'
  }];

  $scope.cards = Array.prototype.slice.call(cardTypes, 0, 0);

  $scope.cardSwiped = function(index) {
    $scope.addCard();
  };

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
  };

  $scope.addCard = function() {
    var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    newCard.id = Math.random();
    $scope.cards.push(angular.extend({}, newCard));
  }
})

.controller('CardCtrl', function($scope, $ionicSwipeCardDelegate) {
  $scope.goAway = function() {
    var card = $ionicSwipeCardDelegate.getSwipeableCard($scope);
    card.swipe();
  };
});
