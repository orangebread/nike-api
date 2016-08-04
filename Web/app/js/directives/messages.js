module.directive('messages', function() {
	return {
	templateUrl: '../../templates/modules/messages-module.html',
	controller: ['$scope', '$http', '$localStorage', function($scope, $http, $localStorage) {
			$scope.inputs = {
				newMessage: ""
			}
			$scope.discussions = [];
			$scope.viewDetails = {
				currentDiscussion: [],
				userId: $localStorage.userID
			};

			$scope.getMessages = function(){

				function success(response){
	        		console.log(response);
	        		$scope.discussions = response.data.result[0].thread;
	        		if($scope.discussions.length > 0)
	        		{
	        			$scope.viewDetails.currentDiscussion = $scope.discussions[0];
	        			$scope.discussions[0].selected = true;
	        		}
				}

				function error(response){
					console.log("error");
					console.log(response);
					alert("Something went wrong.")
				}

				$http({
			      method: 'GET',
			      url: API_BASE_URL+"message",
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
					function success(response){
		        		$scope.discussions[discussion_index].message.push({
							"user_id": $scope.viewDetails.userId,
							"message": $scope.inputs.newMessage,
							"timestamp": moment(new Date()).format("MMM D, YYYY")
						})

						$scope.currentDiscussion = $scope.discussions[discussion_index];

						$scope.inputs.newMessage = "";
					}

					function error(response){
						console.log("error");
						console.log(response);
						alert("Something went wrong.")
					}

					dataParams = {
						message: $scope.inputs.newMessage,
						thread_id: $scope.viewDetails.currentDiscussion.id
					}

					$http({
				      method: 'POST',
				      data: dataParams,
				      url: API_BASE_URL+"message",
				    }).then(success, error);
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