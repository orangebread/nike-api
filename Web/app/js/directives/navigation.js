module.directive('navigation', function() {
	return {
	templateUrl: '../../templates/modules/navigation.html',
	controller: ['$scope', '$http', '$uibModal', '$localStorage', function($scope, $http, $uibModal, $localStorage) {

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

			$scope.$on('loggedIn', function ($event) {
				$scope.user.logged_in = true;
			})
		}]
	};
});

