module.directive('navigation', function() {
	return {
	templateUrl: '../../templates/modules/navigation.html',
	controller: ['$scope', '$http', '$uibModal', '$localStorage', '$timeout', 'modals', function($scope, $http, $uibModal, $localStorage, $timeout, modals) {

			$scope.items = [];
			$scope.user = {
				logged_in: (typeof $localStorage.userID !== "undefined")
			}

			$scope.openTaskModal = function(){
				if($scope.user.logged_in)
				{
					modals.openTaskModal();
				}
				else
				{
					modals.openLoginModal();
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

