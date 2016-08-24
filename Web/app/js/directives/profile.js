module.directive('profile', function() {
	return {
		templateUrl: '../../templates/modules/profile-module.html',
		controller: ['$scope', '$http', '$localStorage', '$location', '$timeout', '$uibModal', function($scope, $http, $localStorage, $location, $timeout, $uibModal) {

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
	        			function applicationSuccess(appResponse){
					      $scope.applications.push(appResponse.data.result)
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

			$scope.decide = function(decision, app_id, job_id, amount){

				function success(response){
	        		console.log(response);
				}

				function error(response){
					console.log("error");
					console.log(response);
					alert("Something went wrong.")
				}

				dataParams = {
					job_id: job_id, 
					application_id: app_id
				}

				var confirmResult = false;
				if(!decision)
				{
					confirmResult = confirm("Are you sure you want to reject this application? Once rejected it cannot be reversed.");
					if(confirmResult)
					{
						$http({
					      method: 'PUT',
					      data: dataParams,
					      url: API_BASE_URL+"application/reject",
					    }).then(success, error);
					}
				}
				else
				{
					$scope.openAcceptModal(app_id, job_id, amount);
				}
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

	        			$timeout(function(){
	        				var height = 0;
		        			$(".applications .application-item").each(function(){
		        				$this = $(this);
		        				if($this.height() > height)
		        					height = $this.height();
		        			})

		        			$(".applications .application-item").height(height);
	        			}, 10)
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

			$scope.goToJob = function(id, userId, title){
	        	$localStorage.currentJobId = id;
	        	$localStorage.currentEmployerId = userId;
	        	$localStorage.currentJobTitle = title;
	        	$location.path("job");
	        }

			$scope.openAcceptModal = function(application_id, job_id, amount){
				$localStorage.amountToPay = amount;
				$localStorage.appId = application_id;
				$localStorage.acceptJobId = job_id;

				var modalInstance = $uibModal.open({
			      animation: true,
			      templateUrl: 'templates/modules/apply-accept-modal.html',
			      controller: 'ApplyAcceptController',
			      resolve: {
			        items: function () {
			          return $scope.items;
			        }
			      }
			    });
			}

			$scope.getApplications();
			$scope.getPostedJobs();
			$scope.getUserDetails();
		}]
	};
});