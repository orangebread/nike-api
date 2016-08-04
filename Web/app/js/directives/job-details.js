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
			    employerUsername: ""
			}

			$scope.job = {};
			
			$scope.user = {
				logged_in: (typeof $localStorage.userID !== "undefined")
			}

			$scope.openApplyModal = function(){
				if($scope.user.logged_in)
				{
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
				else
				{
					$scope.openLoginModal();
				}
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

			$scope.getUserDetails = function(){

				function success(response){
	        		console.log(response);
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

			$scope.getJobDetails();
			$scope.getUserDetails();
		}]
	};
});