module.directive('search', function() {
	return {
	templateUrl: '../../templates/modules/search-list.html',
	controller: ['$scope', '$http', function($scope, $http) {
			$scope.results = [
			
			]

	        $scope.search = function(){
	        	function success(response){
	        		$scope.results = response.data.results;
				}

				function error(response){
					console.log("error")
					console.log(response)
				}

				$http({
					method: 'GET',
					url: "/json/dummy-search",
				}).then(success, error);
	        }
		}]
	};
});