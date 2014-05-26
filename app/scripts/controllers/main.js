'use strict';
angular.module('uncorkedApp')
  .controller('MainCtrl', [function ($scope, $rootScope) {
    $rootScope.currentUser =''
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma',
      'SitePoint'
    ];
  }])

angular.module('uncorkedApp').controller('SignUpController', function($scope, $http, $location){  
	this.signup = {};
	this.addSignup = function(signup){
		$http({url: 'http://localhost:3000/api/users', 
							  data: {'user': {'email': this.signup.email,
																'username': this.signup.username,
																'password': this.signup.password,
																'password confirmation': this.signup.passwordConfirmation }},
							  method: "POST",
							  headers: {'Content-Type': 'application/json'}
							})
		.success(function(data) {
			$location.path('/signin')
		});
		this.signup = {}
	};
});

angular.module('uncorkedApp').controller('SignInController', function($http ,$rootScope, $location){
	this.signin = {};
	this.login = function(signin){
		$http({
			url:'http://localhost:3000/api/users/sign_in',
			data : {'user': {'username': this.signin.username,
											 'password': this.signin.password}},
			method : "POST",
			headers: {'Content-Type': 'application/json'}
		}).success(function(data){
			$rootScope.currentUser = data;
			$location.path('/game')

		})
	}
})
