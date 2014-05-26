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
        controller: "SignUpController"
      })
      .when('/signin',{
        templateUrl: "views/signin.html",
        controller: "SignInController"
      }) 
      .when('/game', {
        templateUrl: 'views/game.html',
        controller: 'GameController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
