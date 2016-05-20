'use strict';

var RUN_LOCAL = false;
var module = angular.module('hourlyadmin', ['ngRoute', 'angularGrid', 'facebook', 'ngScrollbar', 'angular-jwt', 'clickOut', 'angular-taggle', 'youtube-embed', 'ui.router', 'ngStorage', 'angular-web-notification']);
var GROUP_USER_ID = 0;
var USER_ID = 1;
var BASE_URL = "http://ec2-52-201-230-9.compute-1.amazonaws.com:3000";
if(RUN_LOCAL)
	BASE_URL = "http://localhost:3000";

var API_BASE_URL = BASE_URL+"/api/";
var FACEBOOK_APP_ID = "194400397596459";
var BROWSER_FOCUSED = true;

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
			when('/search', {
				templateUrl: 'templates/search.html'
			}).
			when('/login', {
				templateUrl: 'templates/login.html'
			}).
			otherwise({
				redirectTo: '/home'
			});
	}]);


