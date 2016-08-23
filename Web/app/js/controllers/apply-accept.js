module.controller('ApplyAcceptController', function ($scope, $uibModalInstance, $http, $localStorage) {

	$scope.forms = {
		showPaymentForm: false,
		application_id: $localStorage.appId,
		bid_amount: $localStorage.amountToPay,
		job_id: $localStorage.acceptJobId,
		inputs: {
		  title: "",
		  description: "",
		  budget: 0
		},
		paymentSubmitted: false,
		paymentCancelled: false
	}

	$scope.selectPaymentAndAccept = function(){

		$scope.forms.showPaymentForm = true;

		function success(tokenResponse){
			console.log(tokenResponse);
			braintree.setup(tokenResponse.data.result, 'dropin', {
			  container: 'payment-form',
			  onPaymentMethodReceived: function(data){

				  	if(!$scope.forms.paymentSubmitted && !$scope.forms.paymentCancelled)
				  	{
				  		console.log(data);
					  	// if using paypal or there are valid credit card fields
					  	if(data.type != "VALIDATION")
					  	{
					  		$uibModalInstance.dismiss('cancel');
							$scope.forms.showPaymentForm = false;
					  	}

					  	function sendPaymentSucess(paymentResponse){
					  		console.log(paymentResponse)

			        		function acceptSuccess(acceptResponse){
				        		console.log(acceptResponse);
				        		alert("Application accepted and payment sent!")
							}

							function acceptError(acceptResponse){
								console.log("error");
								console.log(acceptResponse);
								alert("Something went wrong.")
								$scope.forms.paymentSubmitted = false;
							}

							dataParams = {
								job_id: $scope.forms.job_id, 
								application_id: $scope.forms.application_id
							}

						  	// $http({
						   //    method: 'PUT',
						   //    data: dataParams,
						   //    url: API_BASE_URL+"application/accept",
						   //  }).then(acceptSuccess, acceptError);
						}

						function sendPaymentError(paymentResponse){
							console.log("error");
							console.log(response);
							alert("Something went wrong.")
							$scope.forms.paymentSubmitted = false;
						}

						dataParams = {
							merchant_id: "jonathan_lane_instant_hs7sqt8h", 
							amount: $scope.forms.bid_amount,
							nonce: data.nonce
						}

					  	$http({
					      method: 'POST',
					      data: dataParams,
					      url: API_BASE_URL+"merchant/process",
					    }).then(sendPaymentSucess, sendPaymentError);

					    // actually send the payment also
					}

					$scope.forms.paymentSubmitted = true;

				},
				onError: function(data){
					if(!$scope.forms.paymentCancelled)
					{
						alert("Please fix the credit card field errors or use paypal.")
					}
				}
			});
		}

		function error(tokenResponse){
			console.log("error");
			console.log(tokenResponse);
			alert("Something went wrong.")
		}

		$http({
	      method: 'GET',
	      url: API_BASE_URL+"merchant/client_token",
	    }).then(success, error);
	}

	$scope.cancel = function () {
		$scope.forms.paymentCancelled = true;
		$scope.forms.showPaymentForm = false;
		$uibModalInstance.dismiss('cancel');
	};

	$scope.submitPayment = function () {
		var form = document.getElementById('checkout');
		var e = document.createEvent('Event');

		e.initEvent('submit', true, true);
		form.dispatchEvent(e);
	};
});