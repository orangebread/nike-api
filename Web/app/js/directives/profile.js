module.directive('profile', function() {
	return {
		templateUrl: '../../templates/modules/profile-module.html',
		controller: ['$scope', '$http', '$localStorage', '$location', function($scope, $http, $localStorage, $location) {

			$scope.applications = [];
			$scope.jobsPosted = [];

			$scope.getApplications = function(){

				function success(response){
	        		console.log(response);
	        		response.data.result.forEach(function(e){
	        			function applicationSuccess(response){
					      $scope.applications.push(response.data.result)
					      console.log($scope.applications);
					    }

					    function applicationError(response){
					      alert("Something bad happened");
					      $log.log(response)
					    }

					    $http({
					      method: 'GET',
					      url: API_BASE_URL+"search/job/"+e.job_id
					    }).then(applicationSuccess, applicationError);
	        		})
				}

				function error(response){
					console.log("error");
					console.log(response);
					alert("Something went wrong.")
				}

				$http({
			      method: 'GET',
			      url: API_BASE_URL+"job/application",
			    }).then(success, error);
			}

			$scope.getPostedJobs = function(){

				function success(response){
	        		console.log(response);
	        		$scope.jobsPosted = response.data.result;
				}

				function error(response){
					console.log("error");
					console.log(response);
					alert("Something went wrong.")
				}

				$http({
			      method: 'GET',
			      url: API_BASE_URL+"job/me",
			    }).then(success, error);
			}

			$scope.logout = function(){
				delete $localStorage.jwtToken;
    			delete $localStorage.userID;
    			delete $localStorage.currentEmployerId;
    			delete localStorage.currentJobId;

    			alert("You have been logged out.")
    			$location.path("home");
			}

			$scope.goToJob = function(id, userId){
	        	$localStorage.currentJobId = id;
	        	$localStorage.currentEmployerId = userId;
	        	$location.path("job");
	        }

			$scope.getApplications();
			$scope.getPostedJobs();
		}]
	};
});