'use strict';

var RUN_LOCAL = false;
var module = angular.module('hourlyadmin', ['ngRoute', 'ui.bootstrap', 'angularGrid', 'facebook', 'angular-jwt', 'clickOut', 'ui.router', 'ngStorage']);
var BASE_URL = "http://ec2-54-211-31-202.compute-1.amazonaws.com:3000";
if(RUN_LOCAL)
	BASE_URL = "http://localhost:3000";

var API_BASE_URL = BASE_URL+"/api/";
var FACEBOOK_APP_ID = "1560501770921087";

module.config(['jwtInterceptorProvider', '$routeProvider', '$httpProvider', 'FacebookProvider',
	function(jwtInterceptorProvider, $routeProvider, $httpProvider, FacebookProvider) {

	jwtInterceptorProvider.tokenGetter = [function() {
		if(localStorage.getItem('ngStorage-jwtToken') != null)
	    	return localStorage.getItem('ngStorage-jwtToken').replace('"', '').replace('"', '');
	    else
	    	return null;
	}];

	$httpProvider.interceptors.push('jwtInterceptor');

	FacebookProvider.init(FACEBOOK_APP_ID);

	$routeProvider.
		when('/home', {
			templateUrl: 'templates/home.html'
		}).
		when('/terms', {
			templateUrl: 'templates/terms.html'
		}).
		when('/search', {
			templateUrl: 'templates/search.html'
		}).
		when('/job', {
			templateUrl: 'templates/job-description.html'
		}).
		when('/profile', {
			templateUrl: 'templates/profile.html'
		}).
		when('/messages', {
			templateUrl: 'templates/messages.html'
		}).
		when('/login', {
			templateUrl: 'templates/login.html'
		}).
		otherwise({
			redirectTo: '/home'
		});
}]);


