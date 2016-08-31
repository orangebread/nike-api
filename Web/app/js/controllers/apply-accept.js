module.controller('ApplyAcceptController', function ($scope, $uibModalInstance, $http, $localStorage) {

	$scope.forms = {
		showPaymentForm: false,
		application_id: $localStorage.appId,
		bid_amount: $localStorage.amountToPay,
		job_id: $localStorage.acceptJobId,
		applicant_user_id: 0,
		applicant_merchant_id: "",
		inputs: {
		  title: "",
		  description: "",
		  budget: 0
		},
		paymentSubmitted: false,
		paymentCancelled: false,
		card: {
			number: "",
			name: "",
			expire: "",
			cvc: ""
		},
		error: {
			card: false
		}
	}

	$scope.showForm = function(){
		$scope.forms.showPaymentForm = true;

		$('#checkout').card({
		    container: '.card-container', // *required*
		});
	}

	$scope.cancel = function () {
		$scope.forms.paymentCancelled = true;
		$scope.forms.showPaymentForm = false;
		$uibModalInstance.dismiss('cancel');
	};

	$scope.getMerchantDetails = function(){

		function success(response){
    		console.log(response);
    		response.data.result.forEach(function(e){
    			if(e.application_id == $localStorage.appId)
    			{
    				$scope.forms.applicant_user_id = e.user_id;
    				$scope.getApplicantMerchantInfo($scope.forms.applicant_user_id);
    			}
    		})
		}

		function error(response){
			console.log("error");
			console.log(response);
			alert("Something went wrong.")
		}

		$http({
	      method: 'GET',
	      url: API_BASE_URL+"job/"+$localStorage.acceptJobId+"/application",
	    }).then(success, error);
	}

	$scope.getApplicantMerchantInfo = function(user_id){

		function success(response){
			console.log("response");
    		console.log(response);
    		$scope.forms.applicant_merchant_id = response.data.result[0].merchant_name;
		}

		function error(response){
			console.log("error");
			console.log(response);
			alert("Something went wrong.")
		}

		$http({
	      method: 'GET',
	      url: API_BASE_URL+"user/"+user_id,
	    }).then(success, error);
	}

	$scope.submitPayment = function () {
		var credit_card_ready = false;

		var cc_result = $("#cc_number").validateCreditCard();
		credit_card_ready = (cc_result.valid && ($scope.forms.card.name.length > 0)
		                    && ($scope.forms.card.cvc.length >= 3) && ($scope.forms.card.expire.replace(/\s+/g, '').length > 4));

		function success(tokenResponse){

			var client = new braintree.api.Client({clientToken: tokenResponse.data.result});
			client.tokenizeCard({
			  number: $scope.forms.card.number,
			  cardholderName: $scope.forms.card.name,
			  expirationDate: $scope.forms.card.expire.replace(/\s+/g, ''),
			  cvv: $scope.forms.card.cvc,
			  billingAddress: {
			    postalCode: '94107'
			  }
			}, function (err, nonce) {
					console.log(err)
				  function sendPaymentSucess(paymentResponse){

			  		if(paymentResponse.data.result.success)
			  		{
			  			function acceptSuccess(acceptResponse){
			        		console.log(acceptResponse);
			        		alert("Application accepted and payment sent!")

			        		// update job workflow
			        		$http({
						      method: 'POST',
						      data: {job_id: $scope.forms.job_id, workflow_id: 2},
						      url: API_BASE_URL+"job/workflow"
						    });

						    $uibModalInstance.dismiss('cancel');
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

					  	$http({
					      method: 'PUT',
					      data: dataParams,
					      url: API_BASE_URL+"application/accept",
					    }).then(acceptSuccess, acceptError);
			  		}
			  		else
			  		{
			  			console.log(paymentResponse);
			  		}
				}

				function sendPaymentError(paymentResponse){
					console.log("error");
					console.log(paymentResponse);
					alert("Something went wrong.")
					$scope.forms.paymentSubmitted = false;
				}

				dataParams = {
					merchant_id: $scope.forms.applicant_merchant_id, 
					amount: $scope.forms.bid_amount,
					payment_method_nonce: nonce
				}

				if($scope.forms.applicant_merchant_id != '')
				{
				  	$http({
				      method: 'POST',
				      data: dataParams,
				      url: API_BASE_URL+"merchant/process",
				    }).then(sendPaymentSucess, sendPaymentError);
				}
			});
		}

		function error(tokenResponse){
			console.log("error");
			console.log(tokenResponse);
			alert("Something went wrong.")
		}

		if(credit_card_ready)
		{
			$scope.forms.error.card = false;
			$http({
		      method: 'GET',
		      url: API_BASE_URL+"merchant/client_token",
		    }).then(success, error);
		}
		else
		{
			$scope.forms.error.card = true;
		}
	};

	$scope.getMerchantDetails();
});