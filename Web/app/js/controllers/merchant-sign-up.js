module.controller('MerchantSignUpController', function ($scope, $uibModalInstance, items, $http, $localStorage) {

	$scope.forms = {
		login: true,
		inputs: {
			first_name: "",
			last_name: "",
			phone: "",
			dob: "",
			tax: "",
			address_1: "",
			address_2: "",
			city: "",
			state: "",
			zip: "",
			business: "",
			b_account: "",
			b_routing: "",
			toc: false,
			email: ""
		},
		error: {
			first_name: false,
			last_name: false,
			phone: false,
			dob: false,
			tax: false,
			address_1: false,
			address_2: false,
			city: false,
			state: false,
			zip: false,
			business: false,
			b_account: false,
			b_routing: false,
			toc: false,
			email: false
		},
		submitted: (typeof $localStorage.merchantID !== 'undefined' && $localStorage.merchantID != ''),
		showSpinner: false
	}

	$scope.signUp = function(){

		var has_errors = false;

		$scope.forms.error.first_name = ($scope.forms.inputs.first_name == '');
		$scope.forms.error.last_name = ($scope.forms.inputs.last_name == '');
		$scope.forms.error.phone = ($scope.forms.inputs.phone == '' || $scope.forms.inputs.phone.length != 10 || isNaN($scope.forms.inputs.phone));
		$scope.forms.error.dob = ($scope.forms.inputs.dob == '');
		$scope.forms.error.address_1 = ($scope.forms.inputs.address_1 == '');
		$scope.forms.error.city = ($scope.forms.inputs.city == '');
		$scope.forms.error.toc = !($scope.forms.inputs.toc);
		$scope.forms.error.state = ($scope.forms.inputs.state == '');
		$scope.forms.error.zip = ($scope.forms.inputs.zip == '' || isNaN($scope.forms.inputs.zip) || $scope.forms.inputs.zip.length != 5);
		$scope.forms.error.b_account = ($scope.forms.inputs.b_account == '' || isNaN($scope.forms.inputs.b_account || $scope.forms.inputs.b_account.length < 8));
		$scope.forms.error.b_routing = ($scope.forms.inputs.b_routing == '' || isNaN($scope.forms.inputs.b_routing || $scope.forms.inputs.b_routing.length < 8));

		has_errors = ($scope.forms.error.first_name || $scope.forms.error.last_name || $scope.forms.error.phone || $scope.forms.error.dob || $scope.forms.error.address_1
		          || $scope.forms.error.city || $scope.forms.error.toc || $scope.forms.error.state || $scope.forms.error.zip || $scope.forms.error.b_account || $scope.forms.error.b_routing);


		function success(response){
			$scope.forms.showSpinner = false;
			if(response.data.success)
			{
				$localStorage.merchantID = response.data.result.id;
				$localStorage.merchantStatus = response.data.result.merchant_status;
				$scope.forms.submitted = true;
			}
			else
			{
				alert("Something went wrong with creating the merchant account.")
			}
		}

		function error(response){
			$scope.forms.showSpinner = false;
			alert("Something bad happened");
		}

		dataParams = {
			first_name: $scope.forms.inputs.first_name,
			last_name: $scope.forms.inputs.last_name,
			email: $scope.forms.inputs.email,
			f_email: $scope.forms.inputs.email,
			phone: $scope.forms.inputs.phone,
			f_mobile_phone: $scope.forms.inputs.phone,
			dob: $scope.forms.inputs.dob,
			ssn: $scope.forms.inputs.ssn,
			street_address: $scope.forms.inputs.address_1,
			address_2: $scope.forms.inputs.address_2,
			locality: $scope.forms.inputs.city,
			region: $scope.forms.inputs.state,
			postal_code: $scope.forms.inputs.zip,
			tos_accepted: $scope.forms.inputs.toc,
			account_number: $scope.forms.inputs.b_account,
			routing_number: $scope.forms.inputs.b_routing,
			business: $scope.forms.inputs.business,
			b_account: $scope.forms.inputs.b_account,
			b_routing: $scope.forms.inputs.b_routing
		}

		if(!has_errors)
		{
			$(".hourly-modal .spinner").height($(".modal-dialog").height());
			$scope.forms.showSpinner = true;

			$http({
				method: 'POST',
				data: dataParams,
				url: API_BASE_URL+"merchant/add"
			}).then(success, error);
		}
	}

	$scope.getUserDetails = function(test){

		$(".hourly-modal .spinner").height($(".modal-dialog").height());
		$scope.forms.showSpinner = true;

		function success(response){
			$scope.forms.showSpinner = false;

			$scope.forms.inputs.email = response.data.result[0].email;
			$localStorage.merchantStatus = response.data.result[0].merchant_status;

			if(test && $localStorage.merchantStatus == "active")
			{
				alert("Your application has been approved!");
				$uibModalInstance.dismiss('cancel');
			}
			else if(test)
			{
				alert("Your application is still pending approval, you will receive an email when it has been approved.");
			}
		}

		function error(response){
			$scope.forms.showSpinner = false;
			alert("Something went wrong.")
		}

		$http({
			method: 'GET',
			url: API_BASE_URL+"user/"+$localStorage.userID,
		}).then(success, error);
	}

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.getUserDetails(false);
});