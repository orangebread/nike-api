module.directive('jobDetails', function() {
	return {
	templateUrl: '../../templates/modules/job-details.html',
	controller: ['$scope', '$http', '$localStorage', '$log', 'modals', function($scope, $http, $localStorage, $log, modals) {

			$scope.forms = {
			    login: true,
			    inputs: {
			    	amount: 0,
			    	days: 0,
			    	notes: ""
			    },
			    employerUsername: "",
			    ableToApply: true
			}

			$scope.job = {};
			
			$scope.user = {
				logged_in: (typeof $localStorage.userID !== "undefined")
			}

			$scope.apply = function(){
				if($scope.user.logged_in)
				{
					if(typeof $localStorage.merchantStatus !== 'undefined' && $localStorage.merchantStatus == 'active')
					{
						modals.openApplyModal();
					}
					else
					{
						modals.openMerchantSignUp();
					}
				}
				else
				{
					modals.openLoginModal();
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
	        		$scope.forms.employerUsername = response.data.result[0].display_name;
				}

				function error(response){
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
				}

				function error(response){
					alert("Something went wrong.")
				}

				$http({
			      method: 'GET',
			      url: API_BASE_URL+"user",
			    }).then(success, error);
			}

			$scope.getJobDetails();
			if($scope.user.logged_in)
			{
				$scope.getEmployerDetails();
				$scope.getUserDetails();
			}
		}]
	};
});