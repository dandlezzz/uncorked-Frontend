'use strict';



angular.module('uncorkedApp')
  .controller('MainCtrl', function ($scope, $rootScope) {
    $rootScope.currentUser =''
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
		$http({url: 'http://localhost:3000/api/users', 
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
			url:'http://localhost:3000/api/users/sign_in',
			data : {'user': {'username': this.signin.username,
											 'password': this.signin.password}},
			method : "POST",
			headers: {'Content-Type': 'application/json'}
		}).success(function(data){
			$rootScope.currentUser = data;
		})
	}
})

angular.module('uncorkedApp').controller('GameController', function($http, $rootScope){
	this.signedin = function(){
		if ($rootScope.currentUser !== ''){
			this.email = $rootScope.currentUser.email;
			return true;
		} else {
			return false;
		}
	};
	
	this.sitAny = function(){
		var that = this;
		$http({
			url : "http://localhost:3000/api/houses",
			params : {"playgame":"blackjack", "token" : $rootScope.currentUser.auth_token.access_token},
			method: "GET",
			headers : {'Content-Type': 'application/json'}
		}).success(function(data){
			$rootScope.currentUser.state = data;
			that.displayGame(data)
		})
	};
	this.bet = {};
	this.chips ='';
	this.dealerCards = ''; 
	this.playerCards = []
	this.showCard ='images/'+ '2' + 'C' +'.png'

	this.placeBet = function(bet){
		var that = this;
		$http({
			url : "http://localhost:3000/api/tables/1",
			params : {"bet":this.bet.amount, "token" : $rootScope.currentUser.auth_token.access_token},
			method: "PUT",
			headers : {'Content-Type': 'application/json'}
		}).success(function(data){
			$rootScope.currentUser.state = data
			console.log(data)
			that.displayGame(data)
			var card1 =[]
			card1 = [ data['House cards'][0]['rank'], data['House cards'][0]['suit'] ]
			that.dealerCards = card1;
			var playerCards = [];
			playerCards.push(data.Hand[0]);
			playerCards.push(data.Hand[1]);
			that.playerCards = playerCards;
		})
	}
	
	this.displayGame = function(data){
		if (data != undefined){
			this.chips = data["User Current Chips"];
		}
		return true;
	}
});

//1 is ace 10 is 10 11 is jack 13 is king
var cards = {
	1: 'Ace',
	2: 'Two',
	3: 'Three',
	4: 'Four',
	5: 'Five',
	6: 'Six',
	7: 'Seven',
	8: 'Eight',
	9: 'Nine',
	10: 'Ten',
	11: 'Jack',
	12: 'Queen',
	13: 'King',
	'C' : 'Clubs',
	'D' : "Diamonds",
	'H' : "Hearts",
	'S' : "Spades"
};


// Object {Table #: null, Game name: "blackjack", Hand: Array[0], Bet: 0, House cards: Array[0]…}
// Action on: 1
// Bet: 0
// Game name: "blackjack"
// Hand: Array[0]
// House Hand Value: Array[0]
// House cards: Array[0]
// Table #: null
// Table limit: Array[2]
// User Current Chips: 500
// User Hand Value: Array[0]
// __proto__: Object

