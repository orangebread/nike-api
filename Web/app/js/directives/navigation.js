module.directive('navigation', function() {
	return {
	templateUrl: '../../templates/modules/navigation.html',
	controller: ['$scope', '$http', '$uibModal', function($scope, $http, $uibModal) {

			$scope.items = ['item1', 'item2', 'item3'];

			$scope.promptLogin = function(){
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

			    modalInstance.result.then(function (selectedItem) {
			      $scope.selected = selectedItem;
			    }, function () {
			      
			    });
			}
		}]
	};
});

