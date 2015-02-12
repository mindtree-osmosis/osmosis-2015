angular.module('starter.filters', ['starter.services'])

.filter('temp', function(Settings) {
  return function(input) {
    if(Settings.getTempUnits() == 'f') {
      return input.fahrenheit;
    }
    return input.celsius;
  };
})

// Silly Wunderground uses a different name for f/c in the hourly forecast
.filter('tempEnglish', function(Settings) {
  return function(input) {
    if(Settings.getTempUnits() == 'f') {
      return input.english;
    }
    return input.metric;
  };
})

.filter('tempInt', function() {
  return function(input) {
    return parseInt(input - 273.15);
  };
})

.filter('removeUnderscore', function() {
  return function(input) {
    var type = input.split("_").join(" ");    
    return type;
  };
})

.filter('getHour', function() {
  return function(input) {
    var fcDate = input.split(" ")[1];
    var hours = parseInt(fcDate.split(":")[0]);
    if(hours < 12){
      hours = hours + " AM";
    }else if (hours === 12){
      hours = (hours) + " PM";
    }else {
      hours = (hours -12) + " PM";
    }
    return hours;
  };
});
