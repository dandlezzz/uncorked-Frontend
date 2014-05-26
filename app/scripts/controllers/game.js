
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
	this.sitAny = function(){
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
		this.winner = ''
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
		})
	};
	this.hit = function(){
		this.playerCards =[];
		var self = this;
		$http({
			url : "http://localhost:3000/api/tables/1",
			params : {"decision":'hit', "token" : $rootScope.currentUser.auth_token.access_token},
			method: "PUT",
			headers : {'Content-Type': 'application/json'}
		}).success(function(data){
			if (data['User Hand Value'].length === 0){
				this.dealerCards = [];
				this.winner ='' ;
				this.houseHandValue = 0;
				this.playerHandValue = 0;
				this.playerCards = 0;
				return this.bust = true;
			} else {
				self.updatePlayerHandValsNPics(data)
			}
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
	this.showWinConditions = false;
	this.calcWinnerOffChips = function(data){
		this.showWinConditions = true;
		var resultantChips = data["User Current Chips"]
		console.log(data)
		if(resultantChips > this.chips && this.houseHandValue === this.playerHandValue ){
			this.winner = "A Push!" ;
		} else if ( resultantChips > this.chips ) {
			this.winner = "You Won!";
		} else if (resultantChips === this.chips) {
			this.winner = "You Lost!"
		}
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
