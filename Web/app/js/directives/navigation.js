module.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});


module.directive('navigation', function() {
	return {
	templateUrl: '../../templates/modules/navigation.html',
	controller: ['$scope', '$http', '$uibModal', function($scope, $http, $uibModal) {

			$scope.items = ['item1', 'item2', 'item3'];

			$scope.promptLogin = function(){
				var modalInstance = $uibModal.open({
			      animation: true,
			      templateUrl: 'myModalContent.html',
			      controller: 'ModalInstanceCtrl',
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

