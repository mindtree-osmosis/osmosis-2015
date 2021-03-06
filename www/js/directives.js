angular.module('starter.directives', [])

.constant('WEATHER_ICONS', {
  '02d': 'ion-ios7-partlysunny-outline',
  '02n': 'ion-ios7-partlysunny-outline',
  '03d': 'ion-ios7-cloudy-outline',
  '03n': 'ion-ios7-cloudy-outline',
  '04d': 'ion-ios7-cloudy-outline',
  '04n': 'ion-ios7-cloudy-outline',
  '09d': 'ion-ios7-rainy-outline',
  '09n': 'ion-ios7-rainy-outline',
  '10d': 'ion-ios7-rainy-outline',
  '10n': 'ion-ios7-rainy-outline',
  '11d': 'ion-ios7-thunderstorm-outline',
  '11n': 'ion-ios7-thunderstorm-outline',
  '01d': 'ion-ios7-sunny-outline',
  '01n': 'ion-ios7-moon-outline',
  '50d': 'ion-ios7-cloudy-outline',
  '50n': 'ion-ios7-cloudy-outline',
})

.directive('weatherIcon', function(WEATHER_ICONS) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      icon: '='
    },
    template: '<i class="icon" ng-class="weatherIcon"></i>',
    link: function($scope) {

      $scope.$watch('icon', function(v) {
        if(!v) { return; }

        var icon = v;

        if(icon in WEATHER_ICONS) {
          $scope.weatherIcon = WEATHER_ICONS[icon];
        } else {
          $scope.weatherIcon = WEATHER_ICONS['cloudy'];
        }
      });
    }
  }
})

.directive('currentTime', function($timeout, $filter) {
  return {
    restrict: 'E',
    replace: true,
    template: '<span class="current-time">{{currentTime}}</span>',
    scope: {
      localtz: '=',
    },
    link: function($scope, $element, $attr) {
      $timeout(function checkTime() {
        if($scope.localtz) {
          $scope.currentTime = $filter('date')(+(new Date), 'h:mm') + $scope.localtz;
        }
        $timeout(checkTime, 500);
      });
    }
  }
 })

.directive('currentWeather', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/current-weather.html',
    scope: true,
    compile: function(element, attr) {
      return function($scope, $element, $attr) {

        var current = $scope.current;
        $scope.$watch('current', function(current) {

           console.log("current "+current);
         if(current && current.main) {
           $scope.highTemp = Math.floor(current.main.temp_max - 273.15);
           $scope.lowTemp = Math.floor(current.main.temp_min - 273.15);
           $scope.currentTemp = Math.floor(current.main.temp - 273.15);
           $scope.humidity = current.main.humidity;
         }
       });
    };
    }
  };
})

.directive('nearBy', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/nearby-places.html',
    scope: true,
    compile: function(element, attr) {
      return function($scope, $element, $attr) {

        var nearByLocationsList = $scope.nearByLocationsList;
        $scope.$watch('nearByLocationsList', function(nearByLocationsList) {
//          if(nearByLocationsList) {
//            $scope.highTemp = Math.floor(current.main.temp_max - 273.15);
//            $scope.lowTemp = Math.floor(current.main.temp_min - 273.15);
//            $scope.currentTemp = Math.floor(current.main.temp - 273.15);
//          }
       });
    };
    }
  };
})

.directive('forecast', function($timeout) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/forecast.html',
    link: function($scope, $element, $attr) {
    }
  }
})

.directive('weatherBox', function($timeout) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      title: '@'
    },
    template: '<div class="weather-box"><h4 class="title">{{title}}</h4><div ng-transclude></div></div>',
    link: function($scope, $element, $attr) {
    }
  }
})

.directive('scrollEffects', function() {
  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      var amt, st, header;
      var bg = document.querySelector('.bg-image');
      $element.bind('scroll', function(e) {
        if(!header) {
          header = document.getElementById('header');
        }
        st = e.detail.scrollTop;
        if(st >= 0) {
          header.style.webkitTransform = 'translate3d(0, 0, 0)';
        } else if(st < 0) {
          header.style.webkitTransform = 'translate3d(0, ' + -st + 'px, 0)';
        }
        amt = Math.min(0.6, st / 1000);

        ionic.requestAnimationFrame(function() {
          header.style.opacty = 1 - amt;
          if(bg) {
            bg.style.opacity = 1 - amt;
          }
        });
      });
    }
  }
})

.directive('backgroundCycler', function($compile, $animate) {
  var animate = function($scope, $element, newImageUrl) {
    var child = $element.children()[0];

    var scope = $scope.$new();
    scope.url = newImageUrl;
    var img = $compile('<background-image></background-image>')(scope);

    $animate.enter(img, $element, null, function() {
      console.log('Inserted');
    });
    if(child) {
      $animate.leave(angular.element(child), function() {
        console.log('Removed');
      });
    }
  };

  return {
    restrict: 'E',
    link: function($scope, $element, $attr) {
      $scope.$watch('activeBgImage', function(v) {
        if(!v) { return; }
        console.log('Active bg image changed', v);
        var item = v;
        var url = "http://farm"+ item.farm +".static.flickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret + "_z.jpg";
        animate($scope, $element, url);
      });
    }
  }
})

.directive('backgroundImage', function($compile, $animate) {
  return {
    restrict: 'E',
    template: '<div class="bg-image"></div>',
    replace: true,
    scope: true,
    link: function($scope, $element, $attr) {
      if($scope.url) {
        $element[0].style.backgroundImage = 'url(' + $scope.url + ')';
      }
    }
  }
})

.directive('starRating', function() {
  return {
    restrict: 'E',
    template: '<i class="icon ion-star"></i>',
    replace: true,
    scope: '=',
    link: function(scope, element, attrs) {
     attrs.$observe('rating', function(value) {
    if (value) {
      console.log(attrs.rating)
    }
  });


    }
  }
});
