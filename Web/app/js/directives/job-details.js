module.directive('jobDetails', function() {
	return {
	templateUrl: '../../templates/modules/job-details.html',
	controller: ['$scope', '$http', '$uibModal', '$localStorage', function($scope, $http, $uibModal, $localStorage) {

			$scope.forms = {
			    login: true,
			    inputs: {
			    	amount: 0,
			    	days: 0,
			    	notes: ""
			    }
			}
			
			$scope.items = [];
			$scope.user = {
				logged_in: (typeof $localStorage.userID !== "undefined")
			}

			$scope.openApplyModal = function(){
				var modalInstance = $uibModal.open({
			      animation: true,
			      templateUrl: 'templates/modules/apply-modal.html',
			      controller: 'ApplyModalController',
			      resolve: {
			        items: function () {
			          return $scope.items;
			        }
			      }
			    });
			}
		}]
	};
});