module.controller('MerchantDetailsController', function ($scope, $uibModalInstance, items, $http) {

	$scope.details = {}
	$scope.forms = {
		showSpinner: false
	}

	$scope.getMerchantDetails = function(){
		$(".hourly-modal .spinner").height($(".modal-dialog").height());
		$scope.forms.showSpinner = true;

		function success(response){
			$scope.forms.showSpinner = false;
			$scope.details = response.data.result;
		}

		function error(response){
			alert("Something went wrong.")
		}

		$http({
	      method: 'GET',
	      url: API_BASE_URL+"merchant",
	    }).then(success, error);
	}

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	setTimeout(function(){
		$scope.getMerchantDetails();
	}, 100)
});