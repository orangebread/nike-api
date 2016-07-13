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
	        		$scope.discussions = response.data.result;
	        		if($scope.discussions.length > 0)
	        		{
	        			$scope.viewDetails.currentDiscussion = $scope.discussions[0];
	        		}
	        		else
	        		{
	        			$scope.discussions.push({
							"id": 12312,
							"job_title": "Test 1",
							"amount_unread": 2,
							"job_employer_id": 23423,
							"job_contractor_id": 32423,
							"date_started": 32432,
							"last_message_date": 234234,
							"selected": true,
							"messages" : [
								{
									"user_id": 23324,
									"user_name": "John Doe",
									"body": "asdfasdf asd fasdf asdfas ",
									"date": 43524,
									"user_avatar": "http://bootdey.com/img/Content/user_1.jpg"
								},
								{
									"user_id": 23324,
									"user_name": "John Doe",
									"body": "asdfasdf asd fasdf asdfas ",
									"date": 43524,
									"user_avatar": "http://bootdey.com/img/Content/user_3.jpg"
								},
								{
									"user_id": 23324,
									"user_name": "John Doe",
									"body": "asdfasdf asd fasdf asdfas ",
									"date": 43524,
									"user_avatar": "http://bootdey.com/img/Content/user_1.jpg"
								},
								{
									"user_id": 23324,
									"user_name": "John Doe",
									"body": "asdfasdf asd fasdf asdfas ",
									"date": 43524,
									"user_avatar": "http://bootdey.com/img/Content/user_3.jpg"
								}
							]
						})

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
		        		$scope.discussions[discussion_index].messages.push({
							"user_id": 1,
							"user_name": "John Doe",
							"body": $scope.inputs.newMessage,
							"date": 43524,
							"user_avatar": "http://bootdey.com/img/Content/user_1.jpg"
						})

						$scope.currentDiscussion = $scope.discussions[discussion_index];
					}

					function error(response){
						console.log("error");
						console.log(response);
						alert("Something went wrong.")
					}

					dataParams = {
						message: $scope.inputs.newMessage,
						received_by: 4
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