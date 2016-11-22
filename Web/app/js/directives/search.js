module.directive('search', function() {
	return {
	templateUrl: '../../templates/modules/search-list.html',
	controller: ['$scope', '$http', '$localStorage', '$location', function($scope, $http, $localStorage, $location) {
			$scope.search = {
				hasResults: false,
				searchTerm: ""
			}

			$scope.results = [
			
			]

	        $scope.search = function(){
	        	function success(response){
	        		$scope.results = response.data.result.filter(function(el){
	        			return (((el.title.toLowerCase().indexOf($scope.searchTerm.toLowerCase()) !== -1) || typeof $scope.searchTerm === "undefined") && el.status_id == 1)
	        		});

	        		$scope.search.hasResults = $scope.results.length > 0;
	        		$scope.search.searchTerm = $scope.searchTerm;
				}

				function error(response){
					console.log("error");
					console.log(response);
					alert("Something went wrong.")
				}

				$http({
			      method: 'GET',
			      url: API_BASE_URL+"search/job",
			    }).then(success, error);
	        }

	        $scope.goToJob = function(id, userId, title){
	        	$localStorage.currentJobId = id;
	        	$localStorage.currentEmployerId = userId;
	        	$localStorage.currentJobTitle = title;
	        	$location.path("job");
	        }

	        $scope.searchTerm = "";
	        $scope.search();
		}]
	};
});