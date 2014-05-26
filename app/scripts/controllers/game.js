
'use strict';
angular.module('uncorkedApp').controller('GameController', function($http, $rootScope){
	this.sitAny = function(){
		var self = this;
		$http({
			url : "http://localhost:3000/api/houses",
			params : {"playgame":"blackjack", "token" : $rootScope.currentUser.auth_token.access_token},
			method: "GET",
			headers : {'Content-Type': 'application/json'}
		}).success(function(data){
			$rootScope.currentUser.state = data;
			self.displayGame(data)
		})
	};
	this.bet = {};
	this.chips ='';
	this.dealerCards = []; 
	this.playerCards = [];
	this.playerHandValue =0;
	

	this.placeBet = function(bet){
		this.playerCards = [];
		this.dealerCards = [];
		var self = this;
		$http({
			url : "http://localhost:3000/api/tables/1",
			params : {"bet":this.bet.amount, "token" : $rootScope.currentUser.auth_token.access_token},
			method: "PUT",
			headers : {'Content-Type': 'application/json'}
		}).success(function(data){
			$rootScope.currentUser.state = data
			self.displayGame(data)
			self.dealerCards.push(Cards.makeImagePath(data['House cards'][0]) )
			var playerCards = [];
			data.Hand.forEach(function(card){
				playerCards.push(Cards.makeImagePath(card))
			})
			self.updatePlayerHandValue(data)
			self.playerCards = playerCards;
		})
	};
	this.updatePlayerHandValue = function(data){
		var self = this;
		this.playerHandValue = 0;
		data['User Hand Value'].forEach(function(val){
				console.log(val)

				self.playerHandValue += val;
			})
	};
	this.hit= function(){
		var self = this;
		$http({
			url : "http://localhost:3000/api/tables/1",
			params : {"decision":'hit', "token" : $rootScope.currentUser.auth_token.access_token},
			method: "PUT",
			headers : {'Content-Type': 'application/json'}
		}).success(function(data){
			$rootScope.currentUser.state = data
			console.log(data)
			self.playerCards.push(Cards.makeImagePath(data.Hand[data.Hand.length-1]))
			self.updatePlayerHandValue(data)
		})
	};
	this.stand = function(){
		var self = this;
		$http({
			url : "http://localhost:3000/api/tables/1",
			params : {"decision":'stand', "token" : $rootScope.currentUser.auth_token.access_token},
			method: "PUT",
			headers : {'Content-Type': 'application/json'}
		}).success(function(data){
			$rootScope.currentUser.state = data
			console.log(data)
			self.dealerCards =[]
			data['House cards'].forEach(function(card){
				self.dealerCards.push(Cards.makeImagePath(card))
			});
			console.log(data)
		});
	};

	this.displayGame = function(data){
		if (data != undefined){
			this.chips = data["User Current Chips"];
		}
		return true;
	}
});

//1 is ace 10 is 10 11 is jack 13 is king
var Cards = {
	makeImagePath: function(cardObject){
		return "images/" +  cardObject['rank'] + cardObject['suit'] +  ".png"
	}
};
