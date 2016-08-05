module.directive('profile', function() {
	return {
		templateUrl: '../../templates/modules/profile-module.html',
		controller: ['$scope', '$http', '$localStorage', '$location', function($scope, $http, $localStorage, $location) {

			$scope.applications = [];
			$scope.jobsPosted = [];
			$scope.userInfo = {};

			$scope.view = {
				showApplications: false,
				fetchedApplications: [],
				jobTitle: ""
			}

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
			      url: API_BASE_URL+"application",
			    }).then(success, error);
			}

			$scope.getPostedJobs = function(){

				function success(response){
	        		console.log(response);
	        		response.data.result.forEach(function(job){
	        			function success(response){
			        		console.log(response);
			        		job.applicationCount = response.data.result.length;
			        		$scope.jobsPosted.push(job);
						}

						function error(response){
							console.log("error");
							console.log(response);
							alert("Something went wrong.")
						}

						$http({
					      method: 'GET',
					      url: API_BASE_URL+"job/"+job.id+"/application",
					    }).then(success, error);
	        		})
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

			$scope.getUserDetails = function(){

				function success(response){
	        		console.log(response);
	        		$scope.userInfo.email = response.data.result.email;
	        		$scope.userInfo.display_name = response.data.result.display_name;
				}

				function error(response){
					console.log("error");
					console.log(response);
					alert("Something went wrong.")
				}

				$http({
			      method: 'GET',
			      url: API_BASE_URL+"user/"+$localStorage.userID,
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

			$scope.getApplicationsForJob = function(id, title)
			{
				function success(response){
	        		console.log(response);
	        		if(response.data.result.length > 0)
	        		{
	        			$scope.view.fetchedApplications = response.data.result;
	        			$scope.view.showApplications = true;
	        			$scope.view.jobTitle = title;
	        		}
	        		else
	        		{
	        			$scope.view.showApplications = false;
	        			alert("No applications for this job yet.")	
	        		}
				}

				function error(response){
					console.log("error");
					console.log(response);
					alert("Something went wrong.")
				}

				$http({
			      method: 'GET',
			      url: API_BASE_URL+"job/"+id+"/application",
			    }).then(success, error);
			}

			$scope.goToJob = function(id, userId){
	        	$localStorage.currentJobId = id;
	        	$localStorage.currentEmployerId = userId;
	        	$location.path("job");
	        }

			$scope.getApplications();
			$scope.getPostedJobs();
			$scope.getUserDetails();
		}]
	};
});