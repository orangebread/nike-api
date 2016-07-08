module.directive('messages', function() {
	return {
	templateUrl: '../../templates/modules/messages-module.html',
	controller: ['$scope', '$http', function($scope, $http) {
			$scope.discussions = [];
			$scope.viewDetails = {
				currentDiscussion: []
			};

			$scope.getMessages = function(){

				function success(response){
	        		console.log(response);
	        		$scope.discussions = response.data.discussions;
	        		if($scope.discussions.length > 0)
	        		{
	        			$scope.viewDetails.currentDiscussion = $scope.discussions[0];
	        		}
				}

				function error(response){
					console.log("error");
					console.log(response);
					alert("Something went wrong.")
				}

				$http({
			      method: 'GET',
			      url: "/json/dummy-discussions",
			    }).then(success, error);
			}

			$scope.changeDiscussion = function($index){
				$scope.unselectAllDiscussions()
				$scope.discussions[$index].selected = true;
				$scope.viewDetails.currentDiscussion = $scope.discussions[$index]
			}

			$scope.unselectAllDiscussions = function(){
				$scope.discussions.forEach(function(discussion){
    				discussion.selected = false;
    			});
			}

			$scope.getMessages();

		}]
	};
});