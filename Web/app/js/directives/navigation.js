module.directive('navigation', function() {
	return {
	templateUrl: '../../templates/modules/navigation.html',
	controller: ['$scope', '$http', '$uibModal', '$localStorage', '$timeout', function($scope, $http, $uibModal, $localStorage, $timeout) {

			$scope.items = [];
			$scope.user = {
				logged_in: (typeof $localStorage.userID !== "undefined")
			}

			$scope.openLoginModal = function(){
				var modalInstance = $uibModal.open({
			      animation: true,
			      templateUrl: 'templates/modules/login-modal.html',
			      controller: 'LoginModalController',
			      resolve: {
			        items: function () {
			          return $scope.items;
			        }
			      }
			    });
			}

			$scope.openTaskModal = function(){
				if($scope.user.logged_in)
				{
					var modalInstance = $uibModal.open({
				      animation: true,
				      templateUrl: 'templates/modules/post-task-modal.html',
				      controller: 'PostTaskController',
				      resolve: {
				        items: function () {
				          return $scope.items;
				        }
				      }
				    });
				}
				else
				{
					$scope.openLoginModal();
				}
			}

			$scope.getUserInfo = function(){

				function success(response){
					if(response.data.success)
					{
						$localStorage.loggedInUsername = response.data.result.display_name;
						$localStorage.loggedInUserEmail = response.data.result.email;
					}
			    }

			    function error(response){
			      alert("Something bad happened");
			      console.log(response)
			    }

			    $http({
			      method: 'GET',
			      url: API_BASE_URL+"user/"+$localStorage.userID
			    }).then(success, error);
			}

			$scope.$on('loggedIn', function ($event) {
				$scope.user.logged_in = true;
				$timeout(function(){
					$scope.getUserInfo();
				}, 5000);
			})

			if($scope.user.logged_in && (typeof $localStorage.loggedInUsername === 'undefined'))
			{
				$scope.getUserInfo();
			}
		}]
	};
});

