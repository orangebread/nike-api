module.controller('LoginModalController', function ($scope, $uibModalInstance, items, $localStorage, $rootScope, Facebook, $http, $log, jwtHelper) {

	$scope.forms = {
		login: true,
		inputs: {
			email: "",
			password: "",
			password_conf: "",
			display_name: ""
		},
		flags: {
			email_error: false,
			password_error: false,
			display_name_error: false,
			bad_creds: false,
			no_password: false
		},
		showSpinner: false
	}

	$scope.loginOrRegister = function(){

		var form_not_valid = true;

		// check email
		$scope.forms.flags.email_error = !validateEmail($scope.forms.inputs.email);

		// check that password was entered
		$scope.forms.flags.no_password = ($scope.forms.inputs.password.length == 0)

		// if registering, check that passwords match
		if(!$scope.forms.login)
		{
			$scope.forms.flags.password_error = ($scope.forms.inputs.password != $scope.forms.inputs.password_conf);
		}

		// check all flags
		form_not_valid = ($scope.forms.flags.email_error || $scope.forms.flags.no_password || $scope.forms.flags.password_error);

		if(!form_not_valid)
		{
			$scope.forms.login ? $scope.doLogin() : $scope.doRegister();
		}
	}

	$scope.doLogin = function(){
		delete $localStorage.jwtToken;
		delete $localStorage.userID;

		$(".hourly-modal .spinner").height($(".modal-dialog").height());
		$scope.forms.showSpinner = true;

		function success(response){
			$scope.forms.showSpinner = false;
			// if logged in successfully
			if(response.data.success)
			{
				$localStorage.jwtToken = response.data.token;
				$localStorage.userID = jwtHelper.decodeToken(response.data.token).id;
				$rootScope.$broadcast('loggedIn');
				$uibModalInstance.dismiss('cancel');
			}
			else
			{
				alert("Wrong username or password");
			}
		}

		function error(response){
			$scope.forms.showSpinner = false;
			$scope.forms.flags.bad_creds = true;
			delete $localStorage.jwtToken;
		}

		dataParams = {
			email: $scope.forms.inputs.email,
			password: $scope.forms.inputs.password
		}

		$http({
			method: 'POST',
			url: API_BASE_URL+"login",
			data: dataParams
		}).then(success, error);
	}

	$scope.doRegister = function(){
		delete $localStorage.jwtToken;
		delete $localStorage.userID;

		$(".hourly-modal .spinner").height($(".modal-dialog").height());
		$scope.forms.showSpinner = true;

		function success(response){
			$scope.forms.showSpinner = false;
			// if registered in successfully
			if(response.data.success)
			{
				$localStorage.jwtToken = response.data.token;
				$localStorage.userID = jwtHelper.decodeToken(response.data.token).id;
				$rootScope.$broadcast('loggedIn');
				$uibModalInstance.dismiss('cancel');
			}
			else
			{
				alert("Wrong username or password");
			}
		}

		function error(response){
			$scope.forms.showSpinner = false;
			alert("Something bad happened");
			delete $localStorage.jwtToken;
		}

		dataParams = {
			email: $scope.forms.inputs.email,
			password: $scope.forms.inputs.password,
			display_name: $scope.forms.inputs.display_name
		}

		$http({
			method: 'POST',
			url: API_BASE_URL+"login/register",
			data: dataParams
		}).then(success, error);
	}

	$scope.fbLogin = function(){
		delete $localStorage.jwtToken;
		delete $localStorage.userID;
		delete $localStorage.username;

		function success(response){
			$scope.forms.showSpinner = false;
			// if logged in successfully
			if(response.data.success)
			{
				$localStorage.jwtToken = response.data.token;
				$localStorage.userID = jwtHelper.decodeToken(response.data.token).id;
				$localStorage.username = response.data.displayName;
				$rootScope.$broadcast('loggedIn');
				$uibModalInstance.dismiss('cancel');
			}
			else
			{
				alert("Wrong username or password");
			}
		}

		function error(response){
			$scope.forms.showSpinner = false;
			alert("Something bad happened");
			delete $localStorage.jwtToken;
		}

		Facebook.login(function(firstResponse) {
			if(firstResponse.status == "connected")
			{
				Facebook.api('/me?fields=email', function(secondResponse) {
					$(".hourly-modal .spinner").height($(".modal-dialog").height());
					$scope.forms.showSpinner = true;
					var email = secondResponse.email;

					dataParams = {                
						fb_id: firstResponse.authResponse.userID,
						fb_token: firstResponse.authResponse.accessToken,
						email: secondResponse.email
					}

					$http({
						method: 'POST',
						url: API_BASE_URL+"login/facebook",
						data: dataParams
					}).then(success, error);

				});
			}
		}, { scope: 'email' });
	}

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

});