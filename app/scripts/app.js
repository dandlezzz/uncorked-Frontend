'use strict';

angular
  .module('uncorkedApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/blackjack'{
        //location service
      })
      .otherwise({
        redirectTo: '/'
      });
  });
