'use strict';( function() {
		var module = angular.module('common.services', []);

		module.factory("gamestepper", [
		function() {
			var websocketUrl = "http://" + document.location.host, socket = io.connect(websocketUrl), clients = [], commandClients = [], newGameAvailableClients = [];

			console.log("connected to ", websocketUrl);

			socket.on("gamestep", function(data) {
				clients.forEach(function(callback) {
					callback._scope.$apply(function() {
						callback(data);
					});
				});
			});

			socket.on("newgameavailable", function(data) {
				newGameAvailableClients.forEach(function(callback) {
					callback._scope.$apply(function() {
						callback(data);
					});
				});
			});

			socket.on("gamecommand", function(data) {
				commandClients.forEach(function(callback) {
					callback._scope.$apply(function() {
						callback(data);
					});
				});
			});

			return {
				register : function(scope, callback) {
					callback._scope = scope;
					clients.push(callback);
				},
				registerForCommand : function(scope, callback) {
					console.log("register", callback);
					callback._scope = scope;
					commandClients.push(callback);
				},
				registerNewGameAvailable : function(scope, callback) {
					callback._scope = scope;
					newGameAvailableClients.push(callback);
				},
				emit : function(name, data) {
					socket.emit(name, data);
				}
			};
		}]);
	}()); 