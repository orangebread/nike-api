module.directive('messages', function() {
	return {
	templateUrl: '../../templates/modules/messages-module.html',
	controller: ['$scope', '$http', function($scope, $http) {
			$scope.inputs = {
				newMessage: ""
			}
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

			$scope.submitMessage = function(){
				var discussion = $scope.discussions.where(function(e){ return e.id == $scope.viewDetails.currentDiscussion.id; })[0];
				var discussion_index = $scope.discussions.indexOf(discussion);

				if($scope.inputs.newMessage != '')
				{
					$scope.discussions[discussion_index].messages.push({
						"user_id": 1,
						"user_name": "John Doe",
						"body": $scope.inputs.newMessage,
						"date": 43524,
						"user_avatar": "http://bootdey.com/img/Content/user_1.jpg"
					})

					$scope.currentDiscussion = $scope.discussions[discussion_index];
				}
				else
				{
					alert("Please type in a message.")
				}
			}

			$scope.getMessages();
		}]
	};
});