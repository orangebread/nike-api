module.directive('callouts', function() {
	return {
	templateUrl: '../../templates/modules/home-callouts.html',
	controller: ['$scope', '$http', '$localStorage', 'modals', function($scope, $http, $localStorage, modals) {

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
		}]
	};
});