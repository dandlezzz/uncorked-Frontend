'use strict';

angular.module('uncorkedApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma',
      'SitePoint'
    ];
  });
  
angular.module('uncorkedApp').controller('SignUpController', function($http){  
	this.signup = {};
	this.signups = [];

	this.addSignup = function(signup){
		this.signups.push(this.signup);
		$http({url: 'http://10.1.10.90:3000/api/users', 
							  data: {'user': {'email': this.signup.email,
																'username': this.signup.username,
																'password': this.signup.password,
																'password confirmation': this.signup.passwordConfirmation }},
							  method: "POST",
							  headers: {'Content-Type': 'application/json'}
							})
		.success(function(data) {
			console.log(data)
		});
		// this.signups.push(this.signup);
		this.signup = {}
	};
});
setInterval(function(){
// request state
},3000)


angular.module('uncorkedApp').controller('SignInController', function($http ,$rootScope){
	this.signin = {};
	this.login = function(signin){
		$http({
			url:'http://10.1.10.90:3000/api/users/sign_in',
			data : {'user': {'username': this.signin.username,
											 'password': this.signin.password}},
			method : "POST",
			headers: {'Content-Type': 'application/json'}
		}).success(function(data){
			$rootScope.currentUser = data;
			console.log(data)
		})
	}
})



angular.module('uncorkedApp').controller('GameController', function($http, $rootScope){
	this.signedin = function(currentUser){
		$rootScope.currentUser.token !== '';
}
});


