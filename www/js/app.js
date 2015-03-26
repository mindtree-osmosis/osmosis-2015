// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','starter.directives','starter.filters','ion-google-place'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

	$ionicConfigProvider.tabs.position("bottom");
	$ionicConfigProvider.navBar.alignTitle("center") // for android default is left
	$ionicConfigProvider.backButton.icon("ion-ios7-arrow-left");
	$ionicConfigProvider.views.maxCache(0);

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.plan', {
    url: '/plan',
    views: {
      'tab-plan': {
        templateUrl: 'templates/tab-plan.html',
        controller: 'PlanCtrl'
      }
    }
  })

  .state('tab.plan-detail', {
    url: '/plan/plan-detail',
    views: {
      'tab-plan': {
        templateUrl: 'templates/tab-plan-detail.html',
        controller: 'PlanDetailCtrl'
      }
    }
  })

  .state('tab.trips', {
      url: '/trips',
      views: {
        'tab-trips': {
          templateUrl: 'templates/tab-trips.html',
          controller: 'TripsCtrl'
        }
      }
    })

    .state('tab.trip-detail', {
      url: '/trips/:tripId',
      views: {
        'tab-trips': {
          templateUrl: 'templates/trip-detail.html',
          controller: 'TripDetailCtrl'
        }
      }
    })

    .state('tab.info', {
      url: '/info',
      views: {
        'tab-info': {
          templateUrl: 'templates/tab-info.html',
          controller: 'ItineraryListCtrl'
        }
      }
    })

    .state('tab.itineraryDetails', {
      url: '/info/itinerary/:city',
      views: {
        'tab-info': {
          templateUrl: 'templates/tab-info-details.html',
					controller: 'ItineraryDetailsCtrl'
        }
      }
    })

    .state('tab.addItinerary', {
      url: '/info/additinerary',
      views: {
        'tab-info': {
          templateUrl: 'templates/createitinerary.html',
          controller: 'CardsCtrl'
        }
      }
    })

    .state('tab.more', {
	    url: '/more',
	    views: {
	      'more': {
	        templateUrl: 'templates/more.html',
	        controller: 'MoreCtrl'
	      }
	    }
	  })

	  .state('tab.currency', {
	    url: '/more/currency',
	    views: {
	      'more': {
	        templateUrl: 'templates/currencyconverter.html',
	        controller: 'CurrencyConverterCtrl'
	      }
	    }
	  })

	  .state('tab.currencylist', {
	    url: '/more/currencylist',
	    views: {
	      'more': {
	        templateUrl: 'templates/countrylist.html',
	        controller: 'CurrencyListCtrl'
	      }
	    }
	  })

	  .state('tab.checklist', {
	    url: '/more/checklist',
	    views: {
	      'more': {
	        templateUrl: 'templates/travelchecklist.html',
	        controller: 'TravelCheckListCtrl'
	      }
	    }
	  })

	  .state('tab.essentials', {
		  url: '/more/essentials',
		  views: {
			  'more': {
				  templateUrl: 'templates/tripessentials.html',
				  controller: 'TravelEssentialsCtrl'
			  }
		  }
	  })

	  .state('tab.offers', {
		  url: '/more/offers',
		  views: {
			  'more': {
				  templateUrl: 'templates/offers.html',
				  controller: 'OffersCtrl'
			  }
		  }
	  })

	  .state('tab.settings', {
		  url: '/more/settings',
		  views: {
			  'more': {
				  templateUrl: 'templates/settings.html',
				  controller: 'SettingsCtrl'
			  }
		  }
	  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/plan');

});
