module.directive('callouts', function() {
	return {
	templateUrl: '../../templates/modules/home-callouts.html',
	controller: ['$scope', '$http', '$uibModal', function($scope, $http, $uibModal) {

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
		}]
	};
});