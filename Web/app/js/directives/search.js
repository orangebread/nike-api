module.directive('search', function() {
	return {
	templateUrl: '../../templates/modules/search-list.html',
	controller: ['$scope', '$http', '$localStorage', '$location', function($scope, $http, $localStorage, $location) {
			$scope.results = [
			
			]

	        $scope.search = function(){
	        	function success(response){
	        		console.log(response);
	        		$scope.results = response.data.result;
				}

				function error(response){
					console.log("error");
					console.log(response);
					alert("Something went wrong.")
				}

				$http({
			      method: 'GET',
			      url: API_BASE_URL+"job",
			    }).then(success, error);
	        }

	        $scope.goToJob = function(id){
	        	$localStorage.currentJobId = id;
	        	$location.path("job");
	        }
		}]
	};
});