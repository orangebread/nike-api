module.directive('profile', function() {
	return {
		templateUrl: '../../templates/modules/profile-module.html',
		controller: ['$scope', '$http', '$localStorage', '$location', '$timeout', '$uibModal', function($scope, $http, $localStorage, $location, $timeout, $uibModal) {

			$scope.applications = [];
			$scope.jobsPosted = [];
			$scope.transactions = [];
			$scope.userInfo = {};

			$scope.view = {
				showApplications: false,
				fetchedApplications: [],
				jobTitle: ""
			}

			$scope.markAsDone = function(job){

				var confirm_result = confirmResult = confirm("Are you sure you want to mark this job as completed? This will notify your employer and you cannot undo it.");

				function success(response){
	        		console.log(response);
	        		job.status_id = 3;
				}

				function error(response){
					console.log("error");
					console.log(response);
					alert("Something went wrong.")
				}

				if(confirm_result)
				{
					$http({
				      method: 'POST',
				      data: {job_id: job.job_id, workflow_id: 3},
				      url: API_BASE_URL+"job/workflow",
				    }).then(success, error);
				}
			}

			$scope.markAsInReview = function(job){

				var confirm_result = confirmResult = confirm("This will mark the job as \"in reivew\", once you have reviewed it you will then have a chance to mark it as complete, which will release the payment to the contractor.");

				function success(response){
	        		console.log(response);
	        		job.status_id = 4;
				}

				function error(response){
					console.log("error");
					console.log(response);
					alert("Something went wrong.")
				}

				if(confirm_result)
				{
					$http({
				      method: 'POST',
				      data: {job_id: job.id, workflow_id: 4},
				      url: API_BASE_URL+"job/workflow",
				    }).then(success, error);
				}
			}

			$scope.markAsComplete = function(job){

				var confirm_result = confirmResult = confirm("This will end the jobs life cycle, mark it as complete and release your payment which is in escrow to the contractor. You cannot undo this.");

				function success(response){
	        		console.log(response);
	        		job.status_id = 5;
				}

				function error(response){
					console.log("error");
					console.log(response);
					alert("Something went wrong.")
				}

				if(confirm_result)
				{
					$http({
				      method: 'POST',
				      data: {job_id: job.id, workflow_id: 5},
				      url: API_BASE_URL+"job/workflow",
				    }).then(success, error);
				}
			}

			$scope.getApplications = function(){

				function success(response){
	        		console.log(response);
	        		response.data.result.forEach(function(e){
	        			function applicationSuccess(appResponse){
	        			  e.jobTitle = appResponse.data.result.title;
	        			  e.budget = appResponse.data.result.budget;
	        			  e.expires_at = appResponse.data.result.expires_at;
	        			  e.employer_id = appResponse.data.result.user_id;
	        			  e.status_id = appResponse.data.result.status_id;
					      $scope.applications.push(e)
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
	        		$scope.userInfo.email = response.data.result[0].email;
	        		$scope.userInfo.display_name = response.data.result[0].display_name;
	        		$scope.userInfo.merchant_name = response.data.result[0].merchant_name;
	        		$scope.userInfo.merchant_status = response.data.result[0].merchant_status;
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

			$scope.decide = function(decision, application){

				function success(response){
	        		console.log(response);
	        		application.application_status = "Passed";
				}

				function error(response){
					console.log("error");
					console.log(response);
					alert("Something went wrong.")
				}

				dataParams = {
					job_id: application.job_id, 
					application_id: application.application_id
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
					$scope.openAcceptModal(application);
				}
			}

			$scope.logout = function(){
				delete $localStorage.jwtToken;
    			delete $localStorage.userID;
    			delete $localStorage.currentEmployerId;
    			delete $localStorage.currentJobId;
    			delete $localStorage.merchantStatus;
    			delete $localStorage.merchantID;

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

			$scope.openAcceptModal = function(application){
				$localStorage.appAcceptUserId = application.user_id;
				$localStorage.amountToPay = application.bid_amount;
				$localStorage.appId = application.application_id;
				$localStorage.acceptJobId = application.job_id;

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

			$scope.getUserTransactions = function(){

				function success(response){
					// console.log("transactions");
	    //     		console.log(response);
	        		//$scope.transactions = response.data.result;
	        		response.data.result.forEach(function(e){

	        			function jobSuccess(jobResponse){
	        			  e.jobTitle = jobResponse.data.result.title;

					      	function userSuccess(userResponse){
		        			  e.userName = userResponse.data.result[0].display_name;
						      $scope.transactions.push(e);
						    }

						    function userError(response){
						      alert("Something bad happened");
						      //$log.log(response)
						    }

						    $http({
						      method: 'GET',
						      url: API_BASE_URL+"user/"+e.user_id
						    }).then(userSuccess, userError);
					    }

					    function jobError(response){
					      alert("Something bad happened");
					      //$log.log(response)
					    }

					    $http({
					      method: 'GET',
					      url: API_BASE_URL+"search/job/"+e.job_id
					    }).then(jobSuccess, jobError);
	        		})
				}

				function error(response){
					console.log("error");
					console.log(response);
					alert("Something went wrong.")
				}

				$http({
			      method: 'GET',
			      url: API_BASE_URL+"merchant/transaction",
			    }).then(success, error);
			}

			$scope.getApplications();
			$scope.getPostedJobs();
			$scope.getUserDetails();
			$scope.getUserTransactions();
		}]
	};
});