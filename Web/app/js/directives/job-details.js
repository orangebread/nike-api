module.directive('jobDetails', function() {
	return {
	templateUrl: '../../templates/modules/job-details.html',
	controller: ['$scope', '$http', '$uibModal', '$localStorage', '$log', function($scope, $http, $uibModal, $localStorage, $log) {

			$scope.forms = {
			    login: true,
			    inputs: {
			    	amount: 0,
			    	days: 0,
			    	notes: ""
			    },
			    employerUsername: "",
			    ableToApply: true, 
			    isMerchant: (typeof $localStorage.merchantStatus !== 'undefined' && $localStorage.merchantStatus == 'active')
			}

			$scope.job = {};
			
			$scope.user = {
				logged_in: (typeof $localStorage.userID !== "undefined")
			}

			$scope.openMerchantSignUp = function(){
				var modalInstance = $uibModal.open({
			      animation: true,
			      templateUrl: 'templates/modules/merchant-sign-up.html',
			      controller: 'MerchantSignUpController',
			      resolve: {
			        items: function () {
			          return [];
			        }
			      }
			    });
			}

			$scope.openApplyModal = function(){
				var modalInstance = $uibModal.open({
			      animation: true,
			      templateUrl: 'templates/modules/apply-modal.html',
			      controller: 'ApplyModalController',
			      resolve: {
			        items: function () {
			          return [];
			        }
			      }
			    });
			}

			$scope.openLoginModal = function(){
				var modalInstance = $uibModal.open({
			      animation: true,
			      templateUrl: 'templates/modules/login-modal.html',
			      controller: 'LoginModalController',
			      resolve: {
			        items: function () {
			          return $scope.items;
			        }
			      }
			    });
			}

			$scope.apply = function(){
				if($scope.user.logged_in)
				{
					if($scope.forms.isMerchant)
					{
						$scope.openApplyModal();
					}
					else
					{
						$scope.openMerchantSignUp();
					}
				}
				else
				{
					$scope.openLoginModal();
				}
			}

			// this fails if the user is not logged in. This call should probably not require JWT
			$scope.getJobDetails = function(){

			    function success(response){
			      $scope.job = response.data.result;
			    }

			    function error(response){
			      alert("Something bad happened");
			      $log.log(response)
			    }

			    $http({
			      method: 'GET',
			      url: API_BASE_URL+"search/job/"+$localStorage.currentJobId
			    }).then(success, error);
			}

			$scope.getEmployerDetails = function(){

				if($localStorage.currentEmployerId == $localStorage.userID)
        		{
        			$scope.forms.ableToApply = false;
        		}

				function success(response){
	        		$scope.forms.employerUsername = response.data.result.display_name;
				}

				function error(response){
					console.log("error");
					console.log(response);
					alert("Something went wrong.")
				}

				$http({
			      method: 'GET',
			      url: API_BASE_URL+"user/"+$localStorage.currentEmployerId,
			    }).then(success, error);
			}

			$scope.getUserDetails = function(){

				if($localStorage.currentEmployerId == $localStorage.userID)
        		{
        			$scope.forms.ableToApply = false;
        		}

				function success(response){
	        		$localStorage.merchantStatus = response.data.result[0].merchant_status;
	        		if($localStorage.merchantStatus == 'active')
	        		{
	        			$scope.forms.isMerchant = true;
	        		}
				}

				function error(response){
					console.log("error");
					console.log(response);
					alert("Something went wrong.")
				}

				$http({
			      method: 'GET',
			      url: API_BASE_URL+"user",
			    }).then(success, error);
			}

			$scope.getJobDetails();
			$scope.getEmployerDetails();
			$scope.getUserDetails();
		}]
	};
});