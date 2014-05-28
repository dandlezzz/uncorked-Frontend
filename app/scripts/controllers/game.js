
'use strict';
angular.module('uncorkedApp').controller('GameController', function($http, $rootScope){
	this.bet = {};
	this.chips ='';
	this.dealerCards = []; 
	this.playerCards = [];
	this.winner ='';
	this.playerHandValue =0;
	this.houseHandValue = 0;
	this.bust = false;
	this.newGame = true;
	this.showBackCard = false;
	this.playing = false;
	this.showWinConditions = false;

	this.sitAny = function(){
		this.playing = true;
		var self = this;
		$http({
			url : "http://localhost:3000/api/houses",
			params : {"playgame":"blackjack", "token" : $rootScope.currentUser.auth_token.access_token},
			method: "GET",
			headers : {'Content-Type': 'application/json'}
		}).success(function(data){;
			self.displayGame(data)
		})
	};
	this.placeBet = function(bet){
		this.showWinConditions = false;
		this.showBackCard = true;
		this.newGame = false;
		this.bust = false;
		this.winner = '';
		this.playerCards = [];
		this.dealerCards = [];
		this.houseHandValue = 0;
		var self = this;
		$http({
			url : "http://localhost:3000/api/tables/1",
			params : {"bet": this.bet.amount, "token" : $rootScope.currentUser.auth_token.access_token},
			method: "PUT",
			headers : {'Content-Type': 'application/json'}
		}).success(function(data){
			self.displayGame(data)
			self.dealerCards.push(Cards.makeImagePath(data['House cards'][0]) )
			self.updatePlayerHandValsNPics(data)
			self.updateHouseHandValue(data)
			if (self.houseHandValue === 21){
				self.dealerBlackJack(data);
			}
		})
	};
	this.dealerBlackJack = function(data){
		console.log("blackjack check triggered")
		console.log(data)
		this.showBackCard = false;
		this.calcWinnerOffChips(data)
		this.updateHouseHandImages(data)
	}
	this.hit = function(){
		this.playerCards =[];
		var self = this;
		$http({
			url : "http://localhost:3000/api/tables/1",
			params : {"decision":'hit', "token" : $rootScope.currentUser.auth_token.access_token},
			method: "PUT",
			headers : {'Content-Type': 'application/json'}
		}).success(function(data){
			self.updatePlayerHandValsNPics(data)
			if (self.playerHandValue > 21){
				self.showBackCard = false;
				self.updateHouseHandImages(data)
				self.bust = true;
				self.newGame = true;
			}
		})
	};
	this.double = function(){
		this.playerCards =[];
		var self = this;
		$http({
			url : "http://localhost:3000/api/tables/1",
			params : {"decision":'double', "token" : $rootScope.currentUser.auth_token.access_token},
			method: "PUT",
			headers : {'Content-Type': 'application/json'}
		}).success(function(data){
			self.updatePlayerHandValsNPics(data)
			if (self.playerHandValue > 21){
				self.bust = true;
				self.newGame = true;
			}
			self.showBackCard = false;
			self.updateHouseHandImages(data)
			self.updateHouseHandValue(data)
			self.calcWinnerOffChips(data)
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
			self.showBackCard = false;
			self.updateHouseHandImages(data)
			self.updateHouseHandValue(data)
			self.calcWinnerOffChips(data)
		});
	};
	this.updatePlayerHandValue = function(data){
		this.playerHandValue = Cards.calcHandValue(data['User Hand Value'])
	};

	this.updateHouseHandValue = function(data){
		this.houseHandValue = Cards.calcHandValue(data['House Hand Value']);
	};
	this.updatePlayerHandCardImages = function(data){
		var self = this;
			data.Hand.forEach(function(card){
				self.playerCards.push(Cards.makeImagePath(card))
			})
	};
	this.updatePlayerHandValsNPics = function(data){
		this.updatePlayerHandValue(data)
		this.updatePlayerHandCardImages(data)
	}
	this.updateHouseHandImages = function(data){
		this.dealerCards =[]
		var self = this;
			data['House cards'].forEach(function(card){
				self.dealerCards.push(Cards.makeImagePath(card))
			});
	}
	this.displayGame = function(data){
		if (data != undefined){
			this.chips = data["User Current Chips"];
		}
		return true;
	}
	this.handOver = function(){
		if (this.bust === true){
			return true;
		} else if (this.winner !== ''){
			return true;
		} else {
			return false;
		}
	}
	

	this.calcWinnerOffChips = function(data){
		this.showWinConditions = true;
		var resultantChips = data["User Current Chips"]
		if(resultantChips > this.chips && this.houseHandValue === this.playerHandValue ){
			this.winner = "A Push!" ;
		} else if ( resultantChips > this.chips ) {
			this.winner = "You Won!";
		} else if (resultantChips === this.chips) {
			this.winner = "You Lost!"
		}
		this.newGame = true;
	}
});
//1 is ace 10 is 10 11 is jack 13 is king
var Cards = {
	makeImagePath: function(cardObject){
		return "images/" +  cardObject['rank'] + cardObject['suit'] +  ".png"
	},
	calcHandValue : function(valueArray){
		var value = 0;
		valueArray.sort().reverse().forEach(function(val){
			if (value > 10 && val === 1){
				value += val;
			} else if (value <= 10 && val === 1){
				value += 11;
			} else {
				value += val;
			}
		})
		return value;
	}
};
