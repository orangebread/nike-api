module.directive('profile', function() {
	return {
		templateUrl: '../../templates/modules/profile-module.html',
		controller: ['$scope', '$http', '$localStorage', '$location', function($scope, $http, $localStorage, $location) {

			$scope.jobs = [];

			$scope.getApplications = function(){

				function success(response){
	        		console.log(response);
	        		response.data.result.forEach(function(e){
	        			function jobSuccess(response){
					      $scope.jobs.push(response.data.result)
					      console.log($scope.jobs);
					    }

					    function jobError(response){
					      alert("Something bad happened");
					      $log.log(response)
					    }

					    $http({
					      method: 'GET',
					      url: API_BASE_URL+"job/"+e.job_id
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
			      url: API_BASE_URL+"job/application",
			    }).then(success, error);
			}

			$scope.getJobDetails = function(id){

			    function success(response){
			      $scope.job = response.data.result;
			    }

			    function error(response){
			      alert("Something bad happened");
			      $log.log(response)
			    }

			    $http({
			      method: 'GET',
			      url: API_BASE_URL+"job/"+$localStorage.currentJobId
			    }).then(success, error);
			}

			$scope.getApplications();
		}]
	};
});